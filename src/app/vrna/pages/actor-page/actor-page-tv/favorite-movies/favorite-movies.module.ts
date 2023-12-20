import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FavoriteMoviesComponent } from './favorite-movies.component';
import { FormsModule } from '@angular/forms';
import { PosterCardTvModule } from '../poster-card-tv/poster-card-tv.module';
import { MovieService } from 'src/app/vrna/services/movie/movie.service';



const FavoriteRouting = RouterModule.forChild([
  {
    path: '',
    component:FavoriteMoviesComponent,
  }
]);


@NgModule({
  declarations: [
    FavoriteMoviesComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    PosterCardTvModule,
    FavoriteRouting
  ],
  providers: [
    MovieService
  ]
})
export class FavoriteMoviesModule { }
