import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { ModalController, LoadingController, isPlatform } from '@ionic/angular';
import { UserService } from 'src/app/shared/services/user.service';
import { WatchlistService } from 'src/app/shared/services/watchlist/watchlist.service';
import { HomeService } from 'src/app/vrna/pages/home/home.service';
import videojs from 'video.js';
import 'videojs-contrib-quality-levels';
import 'videojs-hls-quality-selector';
import { PlayerService } from '../service/player.service';

@Component({
  selector: 'app-web-player',
  templateUrl: './web-player.component.html',
  styleUrls: ['./web-player.component.scss'],
})
export class WebPlayerComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() contentData: any;
  @Input() options: any;
  @Input() continueWatch: boolean;
  @Input() isTrailer: boolean;
  @Input() playerId: string;

  userId: number;
  player: videojs.Player; // Player invoked as variable
  totalDuration: number; // get content total duration
  currentTime: number; // get current time of video playing
  continueWatchTime: number; // get the time while player is paused or closed
  loading: any;

  @ViewChild('target', { static: true }) target: ElementRef;
  @ViewChild('inserttarget', { static: false }) public insertTarget: ElementRef;

  constructor(
    private renderer: Renderer2,
    public modalController: ModalController,
    public loadingController: LoadingController,
    private playerService: PlayerService,
    private userService: UserService,
    private watchlistService: WatchlistService,
    private homeService: HomeService
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
    videojs.Hls.xhr.beforeRequest = (options) => {
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

    });

    this.player.on('play', async () => {
      await loading.dismiss();
      this.onPlay();
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
    this.totalDuration = this.player.duration();
    console.log('On play Total Duration : ' + this.totalDuration);
  }

  async onPause() {
    this.currentTime = this.player.currentTime();
    console.log('On Pause Total Duration : ' + this.currentTime);
    if (this.totalDuration === this.currentTime) {
      this.onPlayEnd();
    } else {
      const calculatePercent = Math.round((this.currentTime * 100) / this.totalDuration);
      const data = {
        userId: this.userId,
        movieId: this.contentData.movieId,
        moviename: this.contentData.moviename,
        posterurl: this.contentData.moviebannerurl ? this.contentData.moviebannerurl : this.contentData.posterurl,
        pauseTime: Math.round(this.currentTime),
        playTime: Math.round(this.totalDuration),
        continuewatching: true,
        percentWatched: calculatePercent
      };
      (await this.watchlistService.addWatchMovie(data)).subscribe((res) => {
        this.watchlistService.getWatchlist();
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
      this.watchlistService.getWatchlist();
    });
  }

  onContinueWatch(time: any) {
    this.player.currentTime(time);
  }

  // set to landscape
  async screenLandscape() {
    if (isPlatform('capacitor')) {
      screen.orientation.lock('landscape');
      await StatusBar.hide();
    }
  }

  goBack() {
    this.modalController.dismiss();
    this.homeService.getContinueWatchData();
    return;
  }

  async ngOnDestroy() {
    // destroy player
    if (this.player) {
      this.player.dispose();
    }
  }

}
