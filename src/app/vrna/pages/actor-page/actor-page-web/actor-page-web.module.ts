import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActorPageWebComponent } from './actor-page-web.component';
import { SliderModule } from 'src/app/components/slider/slider.module';
import { SwiperModule } from 'swiper/angular';
import { RouterModule } from '@angular/router';

const ActorsWebRouting = RouterModule.forChild([
  {
    path: '',
    component:  ActorPageWebComponent,
  }
]);
@NgModule({
  declarations: [
    ActorPageWebComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    SliderModule,
    SwiperModule,
    ActorsWebRouting
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ActorPageWebModule { }
