import { NgModule } from '@angular/core';
import { AddProfileComponent } from './add-profile.component';
import { AddProfileRoutingModule } from './add-profile-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
@NgModule({
  declarations: [
    AddProfileComponent
  ],
  imports: [
    AddProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    IonicModule
  ],
  providers: [
  ]
})
export class AddProfileModule { }
