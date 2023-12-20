import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { SocialShareRoutingModule } from './social-share-routing.module';
import { SocialShareComponent } from './social-share.component';


@NgModule({
  imports: [
    IonicModule,
    SocialShareRoutingModule,
  ],
  declarations: [
    SocialShareComponent
  ],
  exports: [
    SocialShareComponent,
  ],
  providers: [
  ]
})
export class SocialShareModule { }
