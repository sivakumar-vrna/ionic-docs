import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { isPlatform, ModalController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import videojs from 'video.js';
import 'videojs-contrib-quality-levels';
import 'videojs-hls-quality-selector';
import { PlayerService } from './service/player.service';
import { UserService } from 'src/app/shared/services/user.service';
import { WatchlistService } from 'src/app/shared/services/watchlist/watchlist.service';
import { environment } from 'src/environments/environment';
import { HomeService } from 'src/app/vrna/pages/home/home.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlayerComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() contentData: any;
  @Input() options: any;
  @Input() continueWatch: boolean;
  @Input() isTrailer: boolean;
  @Input() playerId: string;

  userId: number;
  player: videojs.Player; // Player invoked as variable
  currentTime: number; // get current time of video playing
  continueWatchTime: number; // get the time while player is paused or closed
  loading: any;

  @ViewChild('target', { static: true }) target: ElementRef;
  @ViewChild('inserttarget', { static: false }) public insertTarget: ElementRef;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    public modalController: ModalController,
    private homeService: HomeService,
    public loadingController: LoadingController,
    private playerService: PlayerService,
    private userService: UserService,
    private watchlistService: WatchlistService
  ) {
    this.screenLandscape();
  }

  async ngOnInit() {
    this.userId = await this.userService.getUserId();
  }

  async ngAfterViewInit() {
    const loading = await this.loadingController.create({
      cssClass: 'player-loader',
      message: 'Please wait...',
    });
    await loading.present();
    const token = await this.userService.getCurrentToken();
    videojs.Vhs.xhr.beforeRequest = (options) => {
      options.headers = {
        vrnaToken: token,
        securityKey: this.playerService.cookie$
      };
      return options;
    };

    this.player = videojs(this.target.nativeElement, this.options, async function onPlayerReady() {

    });

    this.player.hlsQualitySelector({
      displayCurrentQuality: true,
    });

    this.player.on('fullscreenchange', async () => {
      if (isPlatform('capacitor')) {
        const isFullscreen = this.player.isFullscreen();
      }

    });

    this.player.on('play', async () => {
      await loading.dismiss();
      this.onPlay();
      if (isPlatform('capacitor')) {
        this.player.requestFullscreen();
      }
    });

    if (!this.isTrailer) {
      this.player.on('pause', () => {
        this.onPause();
      });
    }

    this.addButton('back', 'arrow_back');
  }

  addButton(name, icon) {
    const div = document.createElement('div');
    div.className = `player-${name}-button-main`;
    div.innerHTML = `<button id="player-${name}-btn"> <ion-icon name="arrow-back-outline"></ion-icon></button>`;

    const playerClass = document.getElementsByClassName('video-js')[0];
    playerClass.appendChild(div);

    const button = document.getElementById(`player-${name}-btn`);
    this.renderer.listen(button, 'click', () => this.goBack());
  }

  async onPlay() {
    if (this.continueWatch) {
      this.onContinueWatch(this.contentData.pauseTime);
      this.continueWatch = false;
    }
  }

  async onPause() {
    const totalDuration = this.player.duration();
    this.currentTime = this.player.currentTime();
    console.log('On Pause Total Duration : ' + this.currentTime);
    if (totalDuration === this.currentTime) {
      this.onPlayEnd();
    } else {
      const calculatePercent = Math.round((this.currentTime * 100) / totalDuration);
      const bannerImageUrl: string = this.contentData.moviebannerurl.replace(`${this.domainUrl}/images`, '');
      const posterImageUrl: string = this.contentData.posterurl.replace(`${this.domainUrl}/images`, '');
      const data = {
        userId: this.userId,
        movieId: this.contentData.movieId,
        moviename: this.contentData.moviename,
        posterurl: bannerImageUrl !== 'undefined' ? bannerImageUrl : posterImageUrl,
        pauseTime: Math.round(this.currentTime),
        playTime: Math.round(totalDuration),
        continuewatching: true,
        percentWatched: calculatePercent
      };
      (await this.watchlistService.addWatchMovie(data)).subscribe((res) => {

      });
    }
  }

  async onPlayEnd() {
    console.log('On play End : ' + this.currentTime);
    const continueDetail = {
      movieId: this.contentData.movieId,
      moviename: this.contentData.moviename,
      userId: this.userId,
      continuewatching: false
    };
    (await this.watchlistService.addWatchMovie(continueDetail)).subscribe((res) => {

    });
  }

  onContinueWatch(time: any) {
    this.player.currentTime(time);
  }

  goBack() {
    this.modalController.dismiss();
    return;
  }

  // set to landscape
  async screenLandscape() {
    if (isPlatform('capacitor')) {
      screen.orientation.lock('landscape');
      await StatusBar.hide();
    }
  }

  async backToState() {
    if (isPlatform('capacitor')) {
      await StatusBar.show();
      screen.orientation.unlock();
    }
    if (this.contentData?.movieId) {
      await this.onPause();
      await this.homeService.getContinueWatchData();
    }
  }

  async ngOnDestroy() {
    await this.backToState();

    // destroy player
    if (this.player) {
      this.player.dispose();
    }
  }

  get domainUrl() {
    if (isPlatform('capacitor')) {
      return environment.capaciorUrl;
    } else {
      return window.location.origin;
    }
  }
}
