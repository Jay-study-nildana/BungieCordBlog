import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/features/auth/services/auth.NotificationService';

@Component({
  selector: 'app-notification',
  templateUrl: './NotificationComponent.component.html'
})
export class NotificationComponent implements OnInit {
  message = '';

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notification$.subscribe(msg => this.message = msg);
  }
}