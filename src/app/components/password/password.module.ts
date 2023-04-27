import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordComponent } from './password.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    PasswordComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    PasswordComponent
  ]
})
export class PasswordModule { }
