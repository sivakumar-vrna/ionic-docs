import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player.component';
import { PlayComponent } from './play/play.component';
import { PlayerService } from './service/player.service';
import { IonicModule } from '@ionic/angular';
import { PlayTrailerComponent } from './play-trailer/play-trailer.component';
import { WebPlayerComponent } from './web-player/web-player.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SwiperModule } from 'swiper/angular';


@NgModule({
  declarations: [
    PlayerComponent,
    PlayComponent,
    PlayTrailerComponent,
    WebPlayerComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    SwiperModule,

  ],
  providers: [
    PlayerService,
    {provide: LOCALE_ID, useValue: 'en-US' }
  ],
  exports: [
    PlayerComponent,
    PlayComponent,
    PlayTrailerComponent,
    WebPlayerComponent
  ]
})
export class PlayerModule { }
