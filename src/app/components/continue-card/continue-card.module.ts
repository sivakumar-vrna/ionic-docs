import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContinueCardComponent } from './continue-card.component';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    ContinueCardComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    LazyLoadImagesModule
  ],
  exports: [
    ContinueCardComponent
  ]
})
export class ContinueCardModule { }
