import { Component, OnInit } from '@angular/core';
import { TicketService } from '../services/ticket.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { TicketStatus } from '../interfaces/ticket-status.enum';


@Component({
  standalone: true,
  selector: 'app-support-dashboard',
  templateUrl: './support-dashboard.component.html',
  styleUrl: './support-dashboard.component.scss',
  imports: [NgIf, NgFor, FormsModule]
})
export class SupportDashboardComponent implements OnInit {
  unassignedTickets: any[] = [];
  myTickets: any[] = [];
  activeTab: string = 'unassigned'; // Default to "Unassigned Tickets"
  //new
  closingTicketId: number | null = null;
  replyText: string = '';


  constructor(private ticketService: TicketService, private authService: AuthService) {}

  ngOnInit() {
    this.loadUserTickets();
    this.loadSupportTickets();
  }

  loadUserTickets() {
    const userId = this.authService.getPersonId(); // Get logged-in user's ID
  
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }
  
    this.ticketService.getUserTickets(userId).subscribe({
      next: (tickets) => {
        this.unassignedTickets = tickets;
        console.log("📥 Loaded tickets from backend:", this.unassignedTickets);
      },
      error: (err) => {
        console.error("Error loading tickets:", err);
        alert("Error loading tickets.");
      },
    });
  }

  loadSupportTickets() {
    const userId = this.authService.getPersonId(); // Get logged-in user's ID
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }
    this.ticketService.getAssignedTickets(userId).subscribe({
      next: (tickets) => {
        this.myTickets = tickets;
      },
      error: (err) => {
        console.error("Error loading my tickets:", err);
      },
    });
  }

  assignTicket(ticket_id: number | null | undefined): void {
    console.log("🔍 Trying to assign ticket with ID:", ticket_id);
  
    if (!ticket_id) {
      console.error("Error: Ticket ID is null or undefined. Cannot assign.");
      alert("Error: Ticket ID is missing.");
      return;
    }
  
    this.ticketService.assignTicket(ticket_id).subscribe({
      next: (updatedTicket) => {
        console.log("Ticket assigned successfully:", updatedTicket);
        this.updateTicketStatus(ticket_id, TicketStatus.IN_PROGRESS); // Auto-update status
        alert("Ticket assigned to you!");
        this.loadUserTickets(); // Refresh the list
        this.loadSupportTickets();
      },
      error: (err) => {
        console.error("Error assigning ticket:", err);
        alert("Failed to assign ticket. It may already be assigned.");
      },
    });
  }
  updateTicketStatus(ticket_id: number, status: TicketStatus) {
    if (status === TicketStatus.CLOSED) {  // ✅ Use enum reference
      this.closingTicketId = ticket_id;
      return; // Open reply input field
    }
  
    this.ticketService.updateTicketStatus(ticket_id, status).subscribe({
      next: () => {
        alert(`Ticket status updated to ${status}`);
        this.loadSupportTickets();
      },
      error: (err) => {
        console.error('Error updating ticket status:', err);
      },
    });
  }

  submitReply() {
    if (!this.replyText.trim()) {
      alert('Reply is required to close the ticket.');
      return;
    }
  
    if (this.closingTicketId) {
      this.ticketService.updateTicketWithReply(
        this.closingTicketId,
        this.replyText,
        TicketStatus.CLOSED // ✅ Use enum instead of string
      ).subscribe({
        next: () => {
          alert('Ticket closed successfully.');
          this.closingTicketId = null;
          this.replyText = '';
          this.loadSupportTickets();
        },
        error: (err) => {
          console.error('Error closing ticket:', err);
        },
      });
    }
  }
  

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      window.location.href = '/login'; // Adjust this to your route or home page
    });
  }


}
