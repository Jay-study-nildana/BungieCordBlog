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

interface ExtraUserInfo {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  address: string;
  registeredDate: string;
  isActive: boolean;
  profileImageUrl: string;
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

  profileVisible = true;

  orders: Order[] = [];
  ordersLoading = false;
  ordersError = '';
  ordersVisible = false;

  extraUserInfo: ExtraUserInfo | null = null;
  extraUserInfoLoading = false;
  extraUserInfoError = '';
  extraUserInfoVisible = false;

  extraUserInfoUpdating = false;
  extraUserInfoUpdateError = '';
  extraUserInfoUpdateSuccess = false;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  ngOnInit() {
    let token = this.cookieService.get('Authorization');
    if (token) {
      this.token = token;
      const headers = new HttpHeaders().set('Authorization', token);
      this.http.get('https://localhost:7226/api/Auth/token-details', { headers })
      .subscribe({
        next: (data: any) => {
          this.profile = data;
          this.useremail = this.profile.email;
        },
        error: () => this.errorMessage = 'Failed to load profile.'
      });
    } else {
      this.errorMessage = 'No token found. Please login.';
    }
  }

  toggleProfile() {
    this.profileVisible = !this.profileVisible;
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

  toggleExtraUserInfo() {
    if (this.extraUserInfoVisible) {
      this.extraUserInfoVisible = false;
    } else {
      this.extraUserInfoVisible = true;
      if (!this.extraUserInfo) {
        this.loadExtraUserInfo();
      }
    }
  }

  loadExtraUserInfo() {
    if (!this.useremail) return;
    this.extraUserInfoLoading = true;
    this.extraUserInfoError = '';
    this.extraUserInfo = null;
    this.extraUserInfoUpdateError = '';
    this.extraUserInfoUpdateSuccess = false;
    const encodedEmail = encodeURIComponent(this.useremail);
    this.http.get<ExtraUserInfo>(`https://localhost:7226/api/UserExtraInfo/by-email/${encodedEmail}`)
      .subscribe({
        next: (data) => {
          this.extraUserInfo = data;
          this.extraUserInfoLoading = false;
        },
        error: () => {
          this.extraUserInfoError = 'Failed to load extra user info.';
          this.extraUserInfoLoading = false;
        }
      });
  }

  updateExtraUserInfo() {
    if (!this.extraUserInfo || !this.extraUserInfo.id) return;
    this.extraUserInfoUpdating = true;
    this.extraUserInfoUpdateError = '';
    this.extraUserInfoUpdateSuccess = false;
    const updatePayload = {
      fullName: this.extraUserInfo.fullName,
      phoneNumber: this.extraUserInfo.phoneNumber,
      role: this.extraUserInfo.role,
      address: this.extraUserInfo.address,
      isActive: this.extraUserInfo.isActive,
      profileImageUrl: this.extraUserInfo.profileImageUrl
    };
    this.http.put<ExtraUserInfo>(
      `https://localhost:7226/api/UserExtraInfo/${this.extraUserInfo.id}`,
      updatePayload
    ).subscribe({
      next: (data) => {
        this.extraUserInfo = data;
        this.extraUserInfoUpdating = false;
        this.extraUserInfoUpdateSuccess = true;
        setTimeout(() => this.extraUserInfoUpdateSuccess = false, 2000);
      },
      error: () => {
        this.extraUserInfoUpdateError = 'Failed to update extra user info.';
        this.extraUserInfoUpdating = false;
      }
    });
  }
}