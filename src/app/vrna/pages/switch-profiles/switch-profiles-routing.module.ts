import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SwitchProfilesComponent } from './switch-profiles.component';

const routes: Routes = [
  {
    path: '',
    component: SwitchProfilesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwitchProfilesRoutingModule { }
