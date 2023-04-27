import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteCardBtnComponent } from './delete-card-btn.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    DeleteCardBtnComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    DeleteCardBtnComponent
  ]
})
export class DeleteCardBtnModule { }
