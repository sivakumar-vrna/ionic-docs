import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from './rating.component';
import { RatingService } from './rating.service';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    RatingComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  providers: [
    RatingService
  ],
  exports: [
    RatingComponent
  ]
})
export class RatingModule { }
