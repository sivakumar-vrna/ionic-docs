import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ErrorComponentRoutingModule } from './error-routing.module';
import { ErrorFivePage } from './504/504.component';
import { ErrorFourPage } from './404/404.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorComponentRoutingModule
  ],
  declarations: [ErrorFivePage, ErrorFourPage]
})
export class ErrorComponentModule { }
