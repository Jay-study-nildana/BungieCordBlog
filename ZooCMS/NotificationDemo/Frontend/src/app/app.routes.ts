import { Routes } from '@angular/router';
import { NotificationsComponent } from './notifications/notifications.component';

export const routes: Routes = [
  { path: 'notifications', component: NotificationsComponent },
  { path: '', redirectTo: 'notifications', pathMatch: 'full' },
];