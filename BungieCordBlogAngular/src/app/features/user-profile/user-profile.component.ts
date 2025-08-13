import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit {
  profile: any = null;
  token: string | null = null;
  errorMessage: string = '';
  copied = false;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  ngOnInit() {
    let token = this.cookieService.get('Authorization');
    if (token) {
      this.token = token;
      const headers = new HttpHeaders().set('Authorization', token);
      this.http.get('https://localhost:7226/api/Auth/token-details', { headers })
        .subscribe({
          next: (data) => this.profile = data,
          error: () => this.errorMessage = 'Failed to load profile.'
        });
    } else {
      this.errorMessage = 'No token found. Please login.';
    }
  }

  copyToken() {
    if (this.token) {
      navigator.clipboard.writeText(this.token).then(() => {
        this.copied = true;
        setTimeout(() => this.copied = false, 1500);
      });
    }
  }
}