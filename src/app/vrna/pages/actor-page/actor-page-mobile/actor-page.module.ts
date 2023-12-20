import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SliderModule } from 'src/app/components/slider/slider.module';
import { ActorPageMobileComponent } from './actor-page.component';
import { SwiperModule } from 'swiper/angular';





@NgModule({
  declarations: [
    ActorPageMobileComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    SliderModule,
    SwiperModule
    
  ]
})
export class ActorPageMobileModule { }
