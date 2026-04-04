import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit(): void {
    // Subscribe to the notifications observable
    const notificationsSub = this.notificationsService.notifications$.subscribe(
      (notifications) => {
        this.notifications = notifications;
      },
      (error) => {
        console.error('Error receiving notifications: ', error);
      }
    );
    this.subscription.add(notificationsSub);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscription.unsubscribe();
  }
}