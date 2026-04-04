import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private hubConnection: signalR.HubConnection | undefined;
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    this.startSignalRConnection();
  }

  private startSignalRConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7071/notificationHub', {
        skipNegotiation: true, // Optional: Use if necessary
        transport: signalR.HttpTransportType.WebSockets, // Ensure WebSockets are used
      }) // Backend SignalR hub URL
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection established.'))
      .catch((err) => console.error('Error while starting SignalR connection: ', err));

    // Listen for notifications from the backend
    this.hubConnection.on('ReceiveNotification', (notification) => {
      console.log('Notification received:', notification); // Debugging
      const currentNotifications = this.notificationsSubject.getValue();
      this.notificationsSubject.next([...currentNotifications, notification]);
    });
  }
}