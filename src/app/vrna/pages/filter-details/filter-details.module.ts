import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { PosterCardModule } from 'src/app/components/poster-card/poster-card.module';
import { MovieDetailsPageModule } from '../movie-details/movie-details.module';
import { FilterDetailsPage } from './filter-details.page';
import { FilterDetailsPageRoutingModule } from './filter-details.routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FilterDetailsPageRoutingModule,
        PosterCardModule,
        MovieDetailsPageModule
    ],
    declarations: [
        FilterDetailsPage
    ]
})
export class FilterDetailsModule { }
