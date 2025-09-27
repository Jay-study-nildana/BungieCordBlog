import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WriterGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUser();
    const roles = user?.roles ?? [];
    if (roles.includes('Writer') && !roles.includes('Admin')) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}