import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HomeComponent } from './home.component';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { TopbarModule } from 'src/app/layout/topbar/topbar.module';
import { VrnaflowService } from 'src/app/shared/services/vrnaflow.service';
import { HttpClientModule } from '@angular/common/http';
import { SliderModule } from 'src/app/components/slider/slider.module';
import { MovieDetailsPageModule } from '../movie-details/movie-details.module';
import { IntelligenceService } from 'src/app/shared/services/intelligence.service';
import { FooterModule } from 'src/app/layout/footer/footer.module';
import { HomeService } from './home.service';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    HttpClientModule,
    HomePageRoutingModule,
    TopbarModule,
    SliderModule,
    MovieDetailsPageModule,
    FooterModule
  ],
  providers: [
    VrnaflowService,
    IntelligenceService,
    DatePipe,
    HomeService
  ]
})
export class HomePageModule { }
