import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosterCardComponent } from './poster-card.component';
import { IonicModule } from '@ionic/angular';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';

@NgModule({
  declarations: [
    PosterCardComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    LazyLoadImagesModule
  ],
  exports: [
    PosterCardComponent
  ]
})
export class PosterCardModule { }
