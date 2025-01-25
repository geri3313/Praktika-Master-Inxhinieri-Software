package com.example.ticketingsystem.repository;

import com.example.ticketingsystem.entity.Ticket;
import com.example.ticketingsystem.entity.TicketStatus;
import com.example.ticketingsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatedBy(User id); // User's tickets

    @Query("SELECT t FROM Ticket t WHERE t.createdBy.id = :userId")
    List<Ticket> findByCreatedBy(@Param("userId") Long userId);

    // Get unassigned tickets (for Support role)
    @Query("SELECT t FROM Ticket t WHERE t.assignedTo IS NULL")
    List<Ticket> findByAssignedToIsNull();

    List<Ticket> findByAssignedTo(User assignedTo);

    @Query("SELECT t FROM Ticket t WHERE t.assignedTo.id = :id")
    List<Ticket> findTicketsAssignedToUser(@Param("id") Long id);

    // Ensure only unassigned tickets can be fetched
    @Query("SELECT t FROM Ticket t WHERE t.assignedTo IS NULL")
    List<Ticket> findUnassignedTickets();

    // Fetch tickets created by a user with status OPEN or IN_PROGRESS
    List<Ticket> findByCreatedByAndStatusIn(User user, List<TicketStatus> statuses);

    // Fetch tickets created by a user with status CLOSED
    List<Ticket> findByCreatedByAndStatus(User user, TicketStatus status);
}
