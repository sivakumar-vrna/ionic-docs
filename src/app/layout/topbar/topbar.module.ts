import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TopbarComponent } from './topbar.component';

@NgModule({
  declarations: [
    TopbarComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  exports: [
    TopbarComponent
  ]
})
export class TopbarModule { }
