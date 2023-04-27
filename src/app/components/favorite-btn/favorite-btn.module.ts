import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteBtnComponent } from './favorite-btn.component';
import { IonicModule } from '@ionic/angular';
import { HomeService } from 'src/app/vrna/pages/home/home.service';

@NgModule({
  declarations: [
    FavoriteBtnComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    FavoriteBtnComponent
  ],
  providers: [
    HomeService
  ]
})
export class FavoriteBtnModule { }
