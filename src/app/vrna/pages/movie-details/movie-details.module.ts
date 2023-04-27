import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MovieDetailsPageRoutingModule } from './movie-details-routing.module';

import { MovieDetailsPage } from './movie-details.page';
import { TopbarModule } from 'src/app/layout/topbar/topbar.module';
import { PlayerModule } from 'src/app/components/player/player.module';
import { RentModule } from 'src/app/components/rent/rent.module';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AddCardModule } from '../../../components/add-card/add-card.module';
import { UiRentDataService } from '../../services/ui-orchestration/ui-rent-data.service';
import { SliderModule } from 'src/app/components/slider/slider.module';
import { FavoriteBtnModule } from 'src/app/components/favorite-btn/favorite-btn.module';
import { RatingModule } from 'src/app/components/rating/rating.module';
import { MovieDetailsService } from './movie-details.service';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MovieDetailsPageRoutingModule,
    TopbarModule,
    PlayerModule,
    RentModule,
    AddCardModule,
    SliderModule,
    FavoriteBtnModule,
    RatingModule,
    LazyLoadImagesModule
  ],
  declarations: [
    MovieDetailsPage
  ],
  exports: [
    MovieDetailsPage,
  ],
  providers: [
    UtilityService,
    UiRentDataService,
    MovieDetailsService
  ]
})
export class MovieDetailsPageModule { }
