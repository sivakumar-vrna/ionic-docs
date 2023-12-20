import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Storage } from '@capacitor/storage';
export const NOTIFICATION_KEY = 'notification_key';
interface Notification {
    message: string;
  }
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
private notificationsSubject = new BehaviorSubject<Notification[]>([]);
public notifications$ = this.notificationsSubject.asObservable();
async showNotification(message: string) {
    const notifications = this.notificationsSubject.value;
    notifications.push({ message });
    this.notificationsSubject.next(notifications);
    await Storage.set({ key: NOTIFICATION_KEY, value: JSON.stringify(notifications) });
  }
}
