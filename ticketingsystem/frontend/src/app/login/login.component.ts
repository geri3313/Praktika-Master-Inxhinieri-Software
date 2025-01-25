import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Access role from nested user object
        const userRole = response.user.role;
        console.log('User Role:', userRole);
  
        if (userRole == 'USER') {
          this.router.navigate(['/user-dashboard']);
        } else if (userRole === 'SUPPORT') {
          this.router.navigate(['/support-dashboard']);
        } else if (userRole === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        }
      },
      error: () => {
        this.snackBar.open('Login failed: Invalid credentials', 'Close', { duration: 3000 });
      },
    });
  }
}  