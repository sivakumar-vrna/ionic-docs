import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleAuthComponent } from './google-auth.component';
import { IonicModule } from '@ionic/angular';
import { ProfileService } from 'src/app/shared/services/profile.service';

@NgModule({
  declarations: [
    GoogleAuthComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    GoogleAuthComponent
  ],
  providers:[
    ProfileService
  ]
})
export class GoogleAuthModule { }
