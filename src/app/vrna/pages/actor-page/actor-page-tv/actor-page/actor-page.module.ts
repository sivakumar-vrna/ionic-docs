import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ActorPageComponent } from './actor-page.component';
import { SliderModule } from 'src/app/components/slider/slider.module';
import { FormsModule } from '@angular/forms';


const ActorsRouting = RouterModule.forChild([
  {
    path: '',
    component: ActorPageComponent,
  }
]);
@NgModule({
  declarations: [
    ActorPageComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    SliderModule,
    FormsModule,
    ActorsRouting
  ]
})
export class ActorPageModule { }
