import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Ticket } from '../interfaces/ticket';
import { TicketStatus } from '../interfaces/ticket-status.enum';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private baseUrl = 'http://localhost:8080/api/tickets';

  constructor(private http: HttpClient) {}

  /**
   * Create a new ticket.
   * @param ticket The ticket data (title, description).
   */
  createTicket(ticketData:Ticket,id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/createTicket/${id}`, ticketData,{responseType:'text'});
  }

  /**
   * Get tickets based on the role of the logged-in user.
   */

  getUserTickets(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${userId}`);
  }

  getAssignedTickets(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/assigned/${userId}`);
  }

  assignTicket(ticket_id: number): Observable<any> {
    const storedUser = localStorage.getItem('user'); // Retrieve user from localStorage
    if (!storedUser) {
      console.error("🚨 No user found in localStorage!");
      return throwError(() => new Error("User not found. Please log in again."));
    }
  
    const user = JSON.parse(storedUser);
    const supportEmail = user.email; // Get user email
  
    return this.http.put(`${this.baseUrl}/${ticket_id}/assign`, { supportEmail });
  }
  
  updateTicketStatus(ticket_id: number, status: TicketStatus): Observable<any> {
    return this.http.put(`${this.baseUrl}/${ticket_id}/status`, { status });
  }
  
  updateTicketWithReply(ticket_id: number, reply: string, status: TicketStatus): Observable<any> {
    return this.http.put(`${this.baseUrl}/${ticket_id}/update`, { reply, status });
  }
  
  
}
