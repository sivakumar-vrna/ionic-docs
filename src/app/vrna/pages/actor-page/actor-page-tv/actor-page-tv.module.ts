import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActorPageTvComponent } from './actor-page-tv.component';
import { ActorPageTvRoutingModule } from './actor-page-tv-routing.module';

@NgModule({
  declarations: [
    ActorPageTvComponent,
  ],
  imports: [
    CommonModule,
    ActorPageTvRoutingModule,
    IonicModule,
  ],
 
})
export class ActorPageTvModule { }
