import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NotificationsComponent } from './notifications/notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NotificationsComponent],
  template: `
    
    <app-notifications></app-notifications> 
  `
})
export class AppComponent {}