import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SettingTvComponent } from './setting-tv.component';



const SettingRouting = RouterModule.forChild([
  {
    path: '',
    component:SettingTvComponent,
  }
]);

@NgModule({
  declarations: [
    SettingTvComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    SettingRouting
  ]
})
export class SettingTvModule { }
