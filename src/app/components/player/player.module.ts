import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player.component';
import { PlayComponent } from './play/play.component';
import { PlayerService } from './service/player.service';
import { IonicModule } from '@ionic/angular';
import { PlayTrailerComponent } from './play-trailer/play-trailer.component';
import { WebPlayerComponent } from './web-player/web-player.component';

@NgModule({
  declarations: [
    PlayerComponent,
    PlayComponent,
    PlayTrailerComponent,
    WebPlayerComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  providers: [
    PlayerService
  ],
  exports: [
    PlayerComponent,
    PlayComponent,
    PlayTrailerComponent,
    WebPlayerComponent
  ]
})
export class PlayerModule { }
