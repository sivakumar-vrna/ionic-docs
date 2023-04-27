import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebPlayerComponent } from './web-player.component';

@NgModule({
  declarations: [
    WebPlayerComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    WebPlayerComponent
  ]
})
export class WebPlayerModule { }
