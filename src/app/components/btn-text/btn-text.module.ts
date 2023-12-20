import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonTextComponent } from './btn-text.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    ButtonTextComponent
  ],
  imports: [
    CommonModule,
    IonicModule    
  ],
  exports: [
    ButtonTextComponent
  ]
})
export class ButtonTextModule { }
