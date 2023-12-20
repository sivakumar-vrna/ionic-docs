import { Component, Input, OnInit } from '@angular/core';
import { NOTIFICATION_KEY, NotificationService } from './notifications.service';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit{
  notifications_new: any[] = [];

  @Input() notifications :any[];
  data : any;
  
  constructor(private notificationService : NotificationService){}


  async ngOnInit() {
    // this.notificationService.notifications$.subscribe((notification) => {
    //   this.notifications_new = notification;
    //   console.log("New Notifications", this.notifications_new); 
    // });
    // this.notifications = (await Storage.get({ key: NOTIFICATION_KEY }))?.value;
    // this.data = JSON.parse(this.notifications);
    console.log(this.notifications);
  }
}
