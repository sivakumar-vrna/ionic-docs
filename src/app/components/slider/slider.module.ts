import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import { IonicModule } from '@ionic/angular';
import { CarouselComponent } from './carousel/carousel.component';
import { BannerComponent } from './banner/banner.component';
import { PosterCardModule } from '../poster-card/poster-card.module';
import { CastSliderComponent } from './cast-slider/cast-slider.component';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';
import { ContinueCardModule } from '../continue-card/continue-card.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    BannerComponent,
    CarouselComponent,
    CastSliderComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    SwiperModule,
    PosterCardModule,
    LazyLoadImagesModule,
    ContinueCardModule,
    MatDialogModule
  ],
  exports: [
    BannerComponent,
    CarouselComponent,
    CastSliderComponent
  ]
})
export class SliderModule { }
