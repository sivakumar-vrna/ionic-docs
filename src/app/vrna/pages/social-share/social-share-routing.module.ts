import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SocialShareComponent } from './social-share.component';

const routes: Routes = [
  {
    path: '',
    component: SocialShareComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocialShareRoutingModule {}
