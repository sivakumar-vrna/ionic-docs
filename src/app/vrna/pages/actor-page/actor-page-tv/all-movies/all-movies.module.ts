import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AllMoviesComponent } from './all-movies.component';
import { PosterCardTvModule } from '../poster-card-tv/poster-card-tv.module';
import { FormsModule } from '@angular/forms';

const AllMoviesRouting = RouterModule.forChild([
  {
    path: '',
    component:AllMoviesComponent,
  }
]);


@NgModule({
  declarations: [
    AllMoviesComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PosterCardTvModule,
    FormsModule,
    AllMoviesRouting

  ]
})
export class AllMoviesModule { }
