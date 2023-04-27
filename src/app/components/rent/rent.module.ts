import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentComponent } from './rent.component';
import { IonicModule } from '@ionic/angular';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { RentService } from './rent.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddCardService } from 'src/app/components/add-card/add-card.service';
import { UiRentDataService } from 'src/app/vrna/services/ui-orchestration/ui-rent-data.service';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';

@NgModule({
  declarations: [
    RentComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    LazyLoadImagesModule
  ],
  exports: [
    RentComponent,
    CommonModule
  ],
  providers: [
    PaymentService,
    RentService,
    AddCardService,
    UiRentDataService
  ]
})
export class RentModule { }
