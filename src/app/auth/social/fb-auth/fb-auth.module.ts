import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FbAuthComponent } from './fb-auth.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    FbAuthComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    FbAuthComponent
  ]
})
export class FbAuthModule { }
