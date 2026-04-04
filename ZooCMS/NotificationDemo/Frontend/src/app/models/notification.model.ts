export interface Notification {
  notificationID: number;
  userID: number;
  type: string;
  message: string;
  timestamp: string;
  status: 'Read' | 'Unread';
}
