import { NgModule } from '@angular/core';
import { SwitchProfilesComponent } from './switch-profiles.component';
import { SwitchProfilesRoutingModule } from './switch-profiles-routing.module';
import { SwitchProfilesService } from './switch-profiles.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    SwitchProfilesComponent
  ],
  imports: [
    SwitchProfilesRoutingModule,
    CommonModule,
    IonicModule
  ],
  providers: [
    SwitchProfilesService
  ]
})
export class SwitchProfilesModule { }
