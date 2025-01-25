import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TicketService } from '../services/ticket.service';
import { NgFor } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { AdminService } from '../services/admin.service';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl:'./admin-dashboard.component.scss',
  imports: [NgFor, ReactiveFormsModule]
})
export class AdminDashboardComponent implements OnInit {
  registerForm: FormGroup;

  users: any[] = [];
  tickets: any[] = [];
  
  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder, private ticketService: TicketService, private adminService: AdminService) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });
   }

  ngOnInit() {
    this.loadUsers();
    //this.loadTickets();
  }

  loadUsers():any{
    this.adminService.getAllUsers().subscribe(
      response =>{
        this.users=response;
      }, error=>{
        console.error("Cant find users: " ,error);
      }
    )
  }
/*
  loadTickets() {
    this.ticketService.getUserTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
      },
      error: () => {
        alert('Error loading tickets.');
      },
    });
  }
    */

  createUser(): void {
    if(this.registerForm.invalid){
      return;
    }
    const formData: User = {
      ...this.registerForm.value,
    };

    this.authService.register(formData).subscribe(response => {
      this.loadUsers();
      console.log('User added successfully', response);
      alert('User added successfully');
    }, error => {
      alert('User was not added!')
      console.error('Error adding user', error);
    });
  }

  deleteUser(id: number): void {
    this.adminService.deleteUser(id).subscribe({
      next: (response) => {
        console.log(`User with ID ${id} deleted successfully. Backend response:`, response);
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
      }
    });
  }  


  logout(): void {
    this.authService.logout().subscribe(() => {
      window.location.href = '/login'; // Adjust this to your route or home page
    });
  }

}
