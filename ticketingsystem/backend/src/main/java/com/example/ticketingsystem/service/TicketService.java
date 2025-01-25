package com.example.ticketingsystem.service;

import com.example.ticketingsystem.dto.TicketDTO;
import com.example.ticketingsystem.entity.Ticket;
import com.example.ticketingsystem.entity.TicketStatus;
import com.example.ticketingsystem.entity.User;
import com.example.ticketingsystem.repository.TicketRepository;
import com.example.ticketingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Ticket> loadTickets() {
        return ticketRepository.findAll();
    }

    /**
     * Create a new ticket.
     */
    public Ticket createTicket(Long id, TicketDTO ticketDto) {
        // Find the user creating the ticket
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Create and set ticket properties
        Ticket ticket = new Ticket();
        ticket.setTitle(ticketDto.getTitle());
        ticket.setDescription(ticketDto.getDescription());
        ticket.setCreatedBy(user);
        ticket.setStatus(TicketStatus.OPEN);

        // If `assignedTo` is provided, assign the ticket
        if (ticketDto.getAssignedTo() != null && !ticketDto.getAssignedTo().isEmpty()) {
            User supportUser = userRepository.findByEmail(ticketDto.getAssignedTo())
                    .orElseThrow(() -> new IllegalArgumentException("Assigned user not found"));
            ticket.setAssignedTo(supportUser);
        }

        return ticketRepository.save(ticket);
    }

    /**
     * Get tickets based on role and filters.
     */
    public List<Ticket> getTicketsByRole(Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        switch (role) {
            case "USER":
                return ticketRepository.findByCreatedBy(user); // Fetch user's tickets

            case "SUPPORT":
                return ticketRepository.findByAssignedToIsNull(); // Fetch unassigned tickets

            case "ADMIN":
                return ticketRepository.findAll(); // Fetch all tickets

            default:
                throw new IllegalArgumentException("Invalid role: " + role);
        }
    }

    /**
     * Update the status of a ticket.
     */
    public Ticket updateTicketStatus(Long ticket_id, TicketStatus status) {
        Ticket ticket = ticketRepository.findById(ticket_id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));

        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicketWithReply(Long ticketId, String reply, TicketStatus status) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));

        if (status == TicketStatus.CLOSED && (reply == null || reply.trim().isEmpty())) {
            throw new IllegalArgumentException("Reply is required to close the ticket.");
        }

        ticket.setReply(reply);
        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }

    /**
     * Assign a ticket to a support staff.
     */
    public Ticket assignTicketToSupport(Long ticket_id, String supportEmail) {
        System.out.println("Assigning ticket with ID: " + ticket_id + " to support: " + supportEmail);

        if (ticket_id == null) {
            throw new IllegalArgumentException("Ticket ID cannot be null");
        }

        if (supportEmail == null || supportEmail.isEmpty()) {
            throw new IllegalArgumentException("Support email cannot be null or empty");
        }

        Ticket ticket = ticketRepository.findById(ticket_id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with ID: " + ticket_id));

        User support = userRepository.findByEmail(supportEmail)
                .orElseThrow(() -> new IllegalArgumentException("Support user not found with email: " + supportEmail));

        // Prevent reassignment if already assigned
        if (ticket.getAssignedTo() != null) {
            throw new IllegalStateException("Ticket is already assigned to: " + ticket.getAssignedTo().getEmail());
        }

        // Assign the ticket
        ticket.setAssignedTo(support);
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAssignedTickets(Long id) {
        return ticketRepository.findTicketsAssignedToUser(id);
    }

    // ✅ Get MyOpenCases (tickets that are OPEN or IN_PROGRESS)
    public List<Ticket> getOpenTicketsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return ticketRepository.findByCreatedByAndStatusIn(user, List.of(TicketStatus.OPEN, TicketStatus.IN_PROGRESS));
    }

    // ✅ Get ClosedCases (tickets that are CLOSED)
    public List<Ticket> getClosedTicketsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return ticketRepository.findByCreatedByAndStatus(user, TicketStatus.CLOSED);
    }
}
