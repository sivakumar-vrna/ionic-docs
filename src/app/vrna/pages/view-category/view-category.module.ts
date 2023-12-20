import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewCategoryPageRoutingModule } from './view-category-routing.module';

import { ViewCategoryPage } from './view-category.page';
import { PosterCardModule } from 'src/app/components/poster-card/poster-card.module';
import { MovieService } from '../../services/movie/movie.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewCategoryPageRoutingModule,
    PosterCardModule,
  ],
  declarations: [ViewCategoryPage],
  providers: [
    MovieService
  ]
})
export class ViewCategoryPageModule { }
