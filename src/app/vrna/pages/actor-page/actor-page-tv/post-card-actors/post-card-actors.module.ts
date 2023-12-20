import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';
import { PostCardActorsComponent } from './post-card-actors.component';



@NgModule({
  declarations: [
    PostCardActorsComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    LazyLoadImagesModule
  ],
  exports:[
    PostCardActorsComponent
  ]
})
export class PostCardActorsModule { }
