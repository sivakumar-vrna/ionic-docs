import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCardComponent } from './add-card.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddCardComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    AddCardComponent
  ]
})
export class AddCardModule { }
