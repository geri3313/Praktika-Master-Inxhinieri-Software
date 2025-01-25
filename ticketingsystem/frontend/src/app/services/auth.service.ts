import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../interfaces/user';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private isBrowser: boolean;
  private personIdKey='id';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object, private adminService: AdminService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      map((user: any) => {
        return user;
      }))
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      map(() => {

          localStorage.removeItem('token');
          localStorage.removeItem('user')
  
      })
    );
  }

  getPersonId(): number | null {
    const user = localStorage.getItem('user'); // Get stored user info
    if (!user) {
      console.error("No user found in localStorage");
      return null;
    }
  
    try {
      const userObj = JSON.parse(user); // Parse user data
      console.log("Retrieved user:", userObj); // Debugging log
      return userObj.id || null; // Ensure 'id' exists
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }

  // Register a new user
  register(userData: User): Observable<String> {
    return this.http.post(`${this.apiUrl}/register`, userData, { responseType: 'text'});
  }
}
