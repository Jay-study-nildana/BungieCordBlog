import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface UserExtraInfo {
  id?: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  address: string;
  registeredDate?: string;
  isActive: boolean;
  profileImageUrl: string;
}

@Component({
  selector: 'app-userextrainfo',
  templateUrl: './userextrainfo.component.html'
})
export class UserextrainfoComponent implements OnInit {
  infos: UserExtraInfo[] = [];
  selectedInfo: UserExtraInfo | null = null;
  isEditing = false;
  loading = false;
  error = '';

  private apiUrl = 'https://localhost:7226/api/UserExtraInfo';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadInfos();
  }

  loadInfos() {
    this.loading = true;
    this.http.get<UserExtraInfo[]>(this.apiUrl).subscribe({
      next: data => {
        this.infos = data;
        this.loading = false;
      },
      error: err => {
        this.error = 'Failed to load data.';
        this.loading = false;
      }
    });
  }

  selectInfo(info: UserExtraInfo) {
    this.selectedInfo = { ...info };
    this.isEditing = true;
  }

  newInfo() {
    this.selectedInfo = {
      email: '',
      fullName: '',
      phoneNumber: '',
      role: '',
      address: '',
      isActive: true,
      profileImageUrl: ''
    };
    this.isEditing = false;
  }

  saveInfo() {
    if (!this.selectedInfo) return;
    this.loading = true;
    if (this.selectedInfo.id) {
      // Update
      this.http.put<UserExtraInfo>(`${this.apiUrl}/${this.selectedInfo.id}`, this.selectedInfo).subscribe({
        next: () => {
          this.loadInfos();
          this.selectedInfo = null;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to update.';
          this.loading = false;
        }
      });
    } else {
      // Create
      this.http.post<UserExtraInfo>(this.apiUrl, this.selectedInfo).subscribe({
        next: () => {
          this.loadInfos();
          this.selectedInfo = null;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to create.';
          this.loading = false;
        }
      });
    }
  }

  deleteInfo(id: string) {
    if (!confirm('Delete this user?')) return;
    this.loading = true;
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.loadInfos();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to delete.';
        this.loading = false;
      }
    });
  }

  cancel() {
    this.selectedInfo = null;
    this.error = '';
  }
}