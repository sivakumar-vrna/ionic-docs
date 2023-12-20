import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    IonicModule,
    NotificationsRoutingModule,
    CommonModule
  ],
  declarations: [
    NotificationsComponent
  ],
  exports: [
    NotificationsComponent
  ],
  providers: [
  ]
})
export class NotificationsModule { }
