import { Component, OnInit } from '@angular/core';
import { TicketService } from '../services/ticket.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Ticket } from '../interfaces/ticket';
import { TicketStatus } from '../interfaces/ticket-status.enum';

@Component({
  standalone: true,
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
  imports: [NgFor, NgIf, ReactiveFormsModule]

})
export class UserDashboardComponent implements OnInit {

  tickets: any[] = [];
  createTicketForm!: FormGroup;
  myOpenCases: any[] = [];
  closedCases: any[] = [];
  activeTab: 'open' | 'closed' = 'open'; // Default tab

  constructor(private ticketService: TicketService,private router:Router, private authService: AuthService, private fb: FormBuilder) {
    this.createTicketForm=this.fb.group({
      title:['',[Validators.required]],
      status:['OPEN'],
      description:['',[Validators.required]],
      reply:[''],
      createdBy:[''],
      assignedTo:['']
    })
  }

  ngOnInit() {
    this.loadUserTickets();
  }

  loadUserTickets() {
    const userId = this.authService.getPersonId();

    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    this.ticketService.getUserTickets(userId).subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        console.log("📥 Loaded tickets from backend:", this.tickets);

        // Filter tickets
        this.myOpenCases = this.tickets.filter(ticket => 
          ticket.status === TicketStatus.OPEN || ticket.status === TicketStatus.IN_PROGRESS
        );

        this.closedCases = this.tickets.filter(ticket => 
          ticket.status === TicketStatus.CLOSED
        );
      },
      error: (err) => {
        console.error("Error loading tickets:", err);
        alert("Error loading tickets.");
      },
    });
  }

 createTicket() {
    console.log("Create Ticket button clicked"); // ✅ Debugging log

    if (this.createTicketForm.invalid) {
      console.log("Form is invalid, stopping execution");
      return;
    }

    const ticketData = this.createTicketForm.value;
    console.log("Form Data:", ticketData); // ✅ Log form data

    const userId = this.authService.getPersonId(); // Get logged-in user ID
    if (userId) {
      this.ticketService.createTicket(ticketData, userId).subscribe({
        next: (response) => {
          console.log("Ticket added successfully:", response);
          this.loadUserTickets();
          alert("Ticket was created successfully!");
        },
        error: (err) => {
          console.error("Error adding ticket:", err);
        }
      });
    } else {
      console.error("Person ID not found");
    }
  }


  

  logout(): void {
    this.authService.logout().subscribe(() => {
      window.location.href = '/login'; // Adjust this to your route or home page
    });
  }
}
