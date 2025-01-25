package com.example.ticketingsystem.controller;

import com.example.ticketingsystem.dto.TicketDTO;
import com.example.ticketingsystem.entity.Ticket;
import com.example.ticketingsystem.entity.TicketStatus;
import com.example.ticketingsystem.entity.User;
import com.example.ticketingsystem.repository.UserRepository;
import com.example.ticketingsystem.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create a new ticket.
     * Accessible by `USER` role.
     */

    @PostMapping("/createTicket/{id}")
    public ResponseEntity<Ticket> createTicket(@PathVariable Long id, @RequestBody TicketDTO ticketDTO) {
        Ticket createdTicket = ticketService.createTicket(id, ticketDTO);
        return ResponseEntity.ok(createdTicket);
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<Ticket>> getTicketsByUserId(@PathVariable Long id) {
        // Find user by ID
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));

        // Get the role of the user
        String role = user.getRole().name();

        // Fetch tickets based on role
        List<Ticket> tickets = ticketService.getTicketsByRole(id, role);

        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/assigned/{id}")
    public ResponseEntity<List<Ticket>> getAssignedTickets(@PathVariable Long id) {
        List<Ticket> assignedTickets = ticketService.getAssignedTickets(id);
        return ResponseEntity.ok(assignedTickets);
    }

    /**
     * Update the status of a ticket.
     * Accessible by `SUPPORT` and `ADMIN` roles.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Ticket> updateTicketStatus(@PathVariable Long id,
            @RequestBody Map<String, String> requestBody) {
        String status = requestBody.get("status");
        Ticket updatedTicket = ticketService.updateTicketStatus(id, TicketStatus.valueOf(status));
        return ResponseEntity.ok(updatedTicket);
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<Ticket> updateTicketWithReply(@PathVariable Long id,
            @RequestBody Map<String, String> requestBody) {
        String status = requestBody.get("status");
        String reply = requestBody.get("reply");

        Ticket updatedTicket = ticketService.updateTicketWithReply(id, reply, TicketStatus.valueOf(status));
        return ResponseEntity.ok(updatedTicket);
    }

    /**
     * Assign a ticket to the logged-in support staff.
     * Accessible by `SUPPORT` role.
     */
    @PutMapping("/{id}/assign")
    public ResponseEntity<Ticket> assignTicket(
            @PathVariable Long id,
            @RequestBody Map<String, String> requestBody) { // Get email from request body

        String supportEmail = requestBody.get("supportEmail"); // Extract email

        if (supportEmail == null || supportEmail.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        Ticket assignedTicket = ticketService.assignTicketToSupport(id, supportEmail);
        return ResponseEntity.ok(assignedTicket);
    }

    @GetMapping("/user/{userId}/open")
    public ResponseEntity<List<Ticket>> getUserOpenCases(@PathVariable Long userId) {
        List<Ticket> tickets = ticketService.getOpenTicketsForUser(userId);
        return ResponseEntity.ok(tickets);
    }

    // ✅ API to get ClosedCases (CLOSED tickets)
    @GetMapping("/user/{userId}/closed")
    public ResponseEntity<List<Ticket>> getUserClosedCases(@PathVariable Long userId) {
        List<Ticket> tickets = ticketService.getClosedTicketsForUser(userId);
        return ResponseEntity.ok(tickets);
    }

}
