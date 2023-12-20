import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';
import { PosterCardTvComponent } from './poster-card-tv.component';



@NgModule({
  declarations: [
    PosterCardTvComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    LazyLoadImagesModule
  ],
  exports:[
    PosterCardTvComponent
  ]
})
export class PosterCardTvModule { }
