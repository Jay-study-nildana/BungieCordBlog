import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from './../../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = 'https://localhost:5001/api/notifications';

  constructor(private http: HttpClient) {}

  getNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/user/${userId}`);
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/mark-as-read/${notificationId}`, {});
  }

  getUnreadCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/unread-count/${userId}`);
  }
}
