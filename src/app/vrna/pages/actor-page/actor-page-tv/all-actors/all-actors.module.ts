import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AllActorsComponent } from './all-actors.component';
import { FormsModule } from '@angular/forms';
import { PostCardActorsModule } from '../post-card-actors/post-card-actors.module';

const AllActorsRouting = RouterModule.forChild([
  {
    path: '',
    component: AllActorsComponent,
  }
]);


@NgModule({
  declarations: [
    AllActorsComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    PostCardActorsModule,
    AllActorsRouting
  ]
})
export class AllActorsModule { }
