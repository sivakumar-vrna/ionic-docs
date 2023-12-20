import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SearchTvComponent } from './search-tv.component';


const SearchTvRouting = RouterModule.forChild([
  {
    path: '',
    component:SearchTvComponent,
  }
]);

@NgModule({
  declarations: [
    SearchTvComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    SearchTvRouting
  ]
})
export class SearchTvModule { }
