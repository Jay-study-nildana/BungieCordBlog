import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface User {
  id: string;
  email: string;
  userName: string;
  roles: string[];
  extraInfoId: string | null;
  fullName: string | null;
  phoneNumber: string | null;
  role: string | null;
  address: string | null;
  registeredDate: string | null;
  isActive: boolean | null;
  profileImageUrl: string | null;
}

interface Role {
  id: string;
  name: string;
}

@Component({
  selector: 'app-advanced-user-management',
  templateUrl: './advanced-user-management.component.html',
  styleUrls: ['./advanced-user-management.component.css']
})
export class AdvancedUserManagementComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  loading = false;
  error: string | null = null;
  detailsUserId: string | null = null;

  roleDropdownUserId: string | null = null;
  selectedRole: string = '';
  roleChangeLoading = false;
  roleChangeError: string | null = null;
  successMessage: string | null = null;

  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBCdW5naWVDb3JkQmxvZy5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOlsiUmVhZGVyIiwiV3JpdGVyIiwiQWRtaW4iXSwiZXhwIjoxNzU3ODAzODExLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MjI2IiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDIwMCJ9.0fC4VyH0MMCnvJ2ra8obnfKXeOAjiuLde5CKfwWkwvE';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchRoles();
  }

  fetchUsers(): void {
    this.loading = true;
    this.error = null;
    const url = 'https://localhost:7226/api/Auth/users-with-extra-info-and-roles';
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get<User[]>(url, { headers }).subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load users.';
        this.loading = false;
      }
    });
  }

  fetchRoles(): void {
    const url = 'https://localhost:7226/api/Auth/roles';
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get<Role[]>(url, { headers }).subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: () => {
        this.roles = [];
      }
    });
  }

  toggleDetails(userId: string): void {
    this.detailsUserId = this.detailsUserId === userId ? null : userId;
  }

  openRoleDropdown(userId: string): void {
    this.roleDropdownUserId = userId;
    this.roleChangeError = null;
    this.successMessage = null;
    this.selectedRole = this.roles.length > 0 ? this.roles[0].name : '';
  }

  closeRoleDropdown(): void {
    this.roleDropdownUserId = null;
    this.roleChangeError = null;
    this.successMessage = null;
  }

  changeUserRole(email: string): void {
    if (!this.selectedRole) {
      this.roleChangeError = 'Please select a role.';
      return;
    }
    this.roleChangeLoading = true;
    this.roleChangeError = null;
    this.successMessage = null;

    const url = 'https://localhost:7226/api/Auth/add-role-to-user';
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      email: email,
      role: this.selectedRole
    };

    this.http.post<any>(url, body, { headers }).subscribe({
      next: (response) => {
        this.roleChangeLoading = false;
        if (response && response.success) {
          this.successMessage = response.message;
          this.closeRoleDropdown();
          this.fetchUsers(); // Refresh user list to show updated roles
        } else {
          this.roleChangeError = response.message || 'Failed to change role.';
        }
      },
      error: () => {
        this.roleChangeLoading = false;
        this.roleChangeError = 'Failed to change role.';
      }
    });
  }
}