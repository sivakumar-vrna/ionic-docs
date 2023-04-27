import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VrnaPageRoutingModule } from './vrna-routing.module';
import { VrnaPage } from './vrna.page';
import { SideMenuModule } from '../layout/side-menu/side-menu.module';
import { FooterModule } from '../layout/footer/footer.module';
import { CastDetailsPageModule } from './pages/cast-details/cast-details.module';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { TopbarModule } from '../layout/topbar/topbar.module';
import { LocationModule } from '../components/location/location.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { VrnaHttpInterceptorService } from './services/interceptors/vrna-http.interceptor';
import { GlobalErrorHandlerService } from './services/error-handler/error-handler.service';
import { HomeService } from './pages/home/home.service';
import { FilterDetailsPage } from './pages/filter-details/filter-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VrnaPageRoutingModule,
    SideMenuModule,
    FooterModule,
    CastDetailsPageModule,
    TopbarModule,
    LocationModule
  ],
  declarations: [
    VrnaPage,
    TransactionsComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: VrnaHttpInterceptorService, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    HomeService
  ]
})
export class VrnaPageModule { }
