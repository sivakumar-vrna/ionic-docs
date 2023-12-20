import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TopbarComponent } from './topbar.component';
import { NotificationsModule } from 'src/app/vrna/pages/notifications/notifications.module';

@NgModule({
  declarations: [
    TopbarComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    NotificationsModule
  ],
  exports: [
    TopbarComponent
  ]
})
export class TopbarModule { }
