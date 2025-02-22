import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationComponent } from './location.component';
import { LocationService } from './location.service';
import { IonicModule } from '@ionic/angular';
import { FilterPipe } from 'src/app/shared/pipes/filter.pipe';
import { HomeService } from 'src/app/vrna/pages/home/home.service';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LocationComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  providers: [
    LocationService,
    HomeService
  ],
  exports: [
    LocationComponent
  ]
})
export class LocationModule { }
