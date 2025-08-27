import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

interface Order {
  id: string;
  userId: string;
  email: string;
  paymentId: string;
  status: number;
  createdDate: string;
  updatedDate: string;
  statusString: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit {
  profile: any = null;
  token: string | null = null;
  errorMessage: string = '';
  copied = false;
  useremail: string | null = null;

  orders: Order[] = [];
  ordersLoading = false;
  ordersError = '';
  ordersVisible = false;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  ngOnInit() {
    let token = this.cookieService.get('Authorization');
    if (token) {
      this.token = token;
      const headers = new HttpHeaders().set('Authorization', token);
      this.http.get('https://localhost:7226/api/Auth/token-details', { headers })
      .subscribe({
        next: (data) => {
          this.profile = data;
          this.useremail = this.profile.email; // Set useremail from profile data
        },
        error: () => this.errorMessage = 'Failed to load profile.'
      });
    } else {
      this.errorMessage = 'No token found. Please login.';
    }
  }

  toggleOrders() {
    if (this.ordersVisible) {
      this.ordersVisible = false;
    } else {
      this.ordersVisible = true;
      this.ordersLoading = true;
      this.ordersError = '';
      this.http.get<Order[]>(`https://localhost:7226/api/Payment/orders/by-email?email=${this.useremail}`)
        .subscribe({
          next: data => {
            this.orders = data;
            this.ordersLoading = false;
          },
          error: () => {
            this.ordersError = 'Could not load orders.';
            this.ordersLoading = false;
          }
        });
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