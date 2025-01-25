package com.example.ticketingsystem.dto;

import com.example.ticketingsystem.entity.TicketStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketDTO {

    private Long ticket_id; // Ticket's unique identifier
    private String title;
    private String description;
    private String reply;
    private TicketStatus status;
    private String createdBy; // Email of creator
    private String assignedTo; // Email of assigned support
    private Long id; // ID of the user creating the ticket

}
