import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Ensure localStorage access only in browser
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      
      if (!token || !userString) {
        // Redirect to login if no user or token
        this.router.navigate(['/login']);
        return false;
      }

      // Parse the user object from localStorage
      const user = JSON.parse(userString);
      const userRole = user.role;
      const expectedRole = route.data['role'];

      if (userRole !== expectedRole) {
        this.redirectToDashboard(userRole);
        return false;
      }

      return true; // Allow navigation if roles match
    }

    // Block navigation on non-browser platforms
    return false;
  }

  private redirectToDashboard(role: string): void {
    const dashboardRoute = `/${role.toLowerCase()}-dashboard`;
    this.router.navigate([dashboardRoute]);
  }
}
