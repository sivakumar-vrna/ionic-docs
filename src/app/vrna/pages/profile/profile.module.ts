import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfilePage } from './profile.page';
import { SavedCardsComponent } from './saved-cards/saved-cards.component';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { AddCardService } from '../../../components/add-card/add-card.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { UserService } from 'src/app/shared/services/user.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { AddCardModule } from '../../../components/add-card/add-card.module';
import { DeleteCardBtnModule } from 'src/app/components/delete-card-btn/delete-card-btn.module';
import { ProfileAddressComponent } from './personal-details/profile-address/profile-address.component';
import { ProfileInfoComponent } from './personal-details/profile-info/profile-info.component';
import { ProfilePageRoutingModule } from './profile-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddCardModule,
    DeleteCardBtnModule,
    ProfilePageRoutingModule
  ],
  declarations: [
    ProfilePage,
    SavedCardsComponent,
    ProfileInfoComponent,
    ProfileAddressComponent
  ],
  providers: [
    PaymentService,
    AddCardService,
    DatePipe,
    ToastWidget,
    UserService,
    ProfileService
  ]
})
export class ProfilePageModule { }
