import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { User } from 'src/app/features/auth/models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: User | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.authService.user().subscribe(u => this.user = u);
  }

  hasAdminRole(): boolean {
    return this.user?.roles?.includes('Admin') ?? false;
  }

  onLogout(): void {
    this.authService.logout();
  }
}