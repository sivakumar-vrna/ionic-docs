import { Component, Input, OnInit } from '@angular/core';
import { isPlatform, ModalController } from '@ionic/angular';
import { Toast } from '@capacitor/toast';
import { setVideoPlayer } from 'src/app/shared/utils/util';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.page.html',
  styleUrls: ['./fullscreen.page.scss'],
})
export class FullscreenPage implements OnInit {
  @Input() url: string;
  @Input() sturl: string;
  @Input() stlang: string;
  @Input() stoptions: any;
  @Input() testApi: boolean;
  @Input() platform: string;

  private videoPlayer: any;
  private handlerPlay: any;
  private handlerPause: any;
  private handlerEnded: any;
  private handlerReady: any;
  private handlerExit: any;
  private first = false;
  private mUrl: string = null;
  private mSturl: string = null;
  private mStlang: string = null;
  private mStoptions: any = null;
  private apiTimer1: any;
  private apiTimer2: any;
  private apiTimer3: any;
  private mTestApi: boolean;

  constructor(public modalCtrl: ModalController) {
    this.screenLandscape();
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
  }

  async ngOnInit() {
    console.log('in ngOnInit');
    this.mTestApi = this.testApi ? this.testApi : false;
    const player: any = await setVideoPlayer();
    console.log(player);
    this.videoPlayer = player.plugin;
    console.log(this.videoPlayer);
    await this.addListenersToPlayerPlugin();
  }
  async ionViewDidEnter() {
    this.mUrl = this.url;
    this.mSturl = this.sturl;
    this.mStlang = this.stlang;
    this.mStoptions = this.stoptions;
    if (this.mUrl != null) {
      if (this.mTestApi) {
        this.first = true;
      }
      const res: any = await this.videoPlayer.initPlayer({
        mode: 'fullscreen',
        url: this.mUrl,
        subtitle: this.mSturl,
        language: this.mStlang,
        subtitleOptions: this.mStoptions,
        playerId: 'fullscreen',
        componentTag: 'app-fullscreen',
      });
      console.log(`res ${JSON.stringify(res)}`);
      if (
        !res.result &&
        (this.platform === 'ios' || this.platform === 'android')
      ) {
        await Toast.show({
          text: res.message,
          duration: 'long',
          position: 'bottom',
        });
      }
      console.log('res.result ', res.result);
      if (!res.result) {
        console.log(`res.message ${res.message}`);
      }
    }
  }

  private async leaveModal(): Promise<void> {
    if (this.mTestApi) {
      // Clear the timer
      clearTimeout(this.apiTimer3);
      clearTimeout(this.apiTimer2);
      clearTimeout(this.apiTimer1);
    }
    await this.videoPlayer.stopAllPlayers();

    // Remove all the plugin listeners
    this.handlerPlay.remove();
    this.handlerPause.remove();
    this.handlerEnded.remove();
    this.handlerReady.remove();
    this.handlerExit.remove();
    // Dismiss the modal view
    this.modalCtrl.dismiss({
      dismissed: true,
    });
    return;
  }
  private async addListenersToPlayerPlugin(): Promise<void> {
    this.handlerPlay = await this.videoPlayer.addListener(
      'jeepCapVideoPlayerPlay',
      (data: any) => this.playerPlay(data),
      false
    );
    this.handlerPause = await this.videoPlayer.addListener(
      'jeepCapVideoPlayerPause',
      (data: any) => this.playerPause(data),
      false
    );
    this.handlerEnded = await this.videoPlayer.addListener(
      'jeepCapVideoPlayerEnded',
      (data: any) => this.playerEnd(data),
      false
    );
    this.handlerExit = await this.videoPlayer.addListener(
      'jeepCapVideoPlayerExit',
      (data: any) => this.playerExit(data),
      false
    );
    this.handlerReady = await this.videoPlayer.addListener(
      'jeepCapVideoPlayerReady',
      async (data: any) => this.playerReady(data),
      false
    );
    return;
  }
  private async playerPlay(data: any): Promise<void> {
    console.log(`Event jeepCapVideoPlayerPlay`);
    console.log(data);
    return;
  }
  private async playerPause(data: any): Promise<void> {
    console.log(`Event jeepCapVideoPlayerPause ${data}`);
    return;
  }
  private async playerEnd(data: any): Promise<void> {
    console.log(`Event jeepCapVideoPlayerEnded ${data}`);
    await this.leaveModal();
    return;
  }
  private async playerExit(data: any): Promise<void> {
    console.log(`Event jeepCapVideoPlayerExit ${data}`);
    this.backToState();
    await this.leaveModal();
    return;
  }
  private async playerReady(data: any): Promise<void> {
    console.log(`Event jeepCapVideoPlayerReady:`);
    console.log(data);
    console.log(`testVideoPlayerPlugin testAPI ${this.mTestApi}`);
    console.log(`testVideoPlayerPlugin first ${this.first}`);
    if (this.mTestApi && this.first) {
      // test the API
      this.first = false;
      console.log('testVideoPlayerPlugin calling isPlaying ');
      let isPlaying = await this.videoPlayer.isPlaying({
        playerId: 'fullscreen',
      });
      console.log(` isPlaying ${isPlaying}`);
      this.apiTimer1 = setTimeout(async () => {
        let pause = await this.videoPlayer.pause({ playerId: 'fullscreen' });
        console.log(`pause ${pause}`);
        isPlaying = await this.videoPlayer.isPlaying({
          playerId: 'fullscreen',
        });
        console.log(`const isPlaying after pause ${isPlaying}`);
        const currentTime = await this.videoPlayer.getCurrentTime({
          playerId: 'fullscreen',
        });
        console.log('const currentTime ', currentTime);
        let muted = await this.videoPlayer.getMuted({ playerId: 'fullscreen' });
        if (muted.value) {
          console.log('getMuted true');
        } else {
          console.log('getMuted false');
        }
        let setMuted = await this.videoPlayer.setMuted({
          playerId: 'fullscreen',
          muted: !muted.value,
        });
        if (setMuted.value) {
          console.log('setMuted true');
        } else {
          console.log('setMuted false');
        }
        muted = await this.videoPlayer.getMuted({ playerId: 'fullscreen' });
        if (muted.value) {
          console.log('getMuted true');
        } else {
          console.log('getMuted false');
        }
        let duration = await this.videoPlayer.getDuration({
          playerId: 'fullscreen',
        });
        console.log(`duration ${duration}`);
        // valid for movies havin a duration > 25
        const seektime =
          currentTime.value + 0.5 * duration.value < duration.value - 25
            ? currentTime.value + 0.5 * duration.value
            : duration.value - 25;
        let setCurrentTime = await this.videoPlayer.setCurrentTime({
          playerId: 'fullscreen',
          seektime,
        });
        console.log('setCurrentTime ', setCurrentTime.value);
        let play = await this.videoPlayer.play({ playerId: 'fullscreen' });
        console.log(`play ${play}`);
        this.apiTimer2 = setTimeout(async () => {
          setMuted = await this.videoPlayer.setMuted({
            playerId: 'fullscreen',
            muted: false,
          });
          console.log('setMuted ', setMuted);
          const setVolume = await this.videoPlayer.setVolume({
            playerId: 'fullscreen',
            volume: 0.5,
          });
          console.log(`setVolume ${setVolume}`);
          let volume = await this.videoPlayer.getVolume({
            playerId: 'fullscreen',
          });
          console.log(`Volume ${volume}`);
          this.apiTimer3 = setTimeout(async () => {
            pause = await this.videoPlayer.pause({ playerId: 'fullscreen' });
            console.log('const pause ', pause);
            duration = await this.videoPlayer.getDuration({
              playerId: 'fullscreen',
            });
            console.log(`duration ${duration}`);
            volume = await this.videoPlayer.setVolume({
              playerId: 'fullscreen',
              volume: 1.0,
            });
            console.log(`Volume ${volume}`);
            setCurrentTime = await this.videoPlayer.setCurrentTime({
              playerId: 'fullscreen',
              seektime: duration.value - 3,
            });
            console.log(`setCurrentTime ${setCurrentTime}`);
            play = await this.videoPlayer.play({ playerId: 'fullscreen' });
            console.log(`play ${play}`);
          }, 10000);
        }, 8000);
      }, 7000);
    }
    return;
  }

  async ngOnDestroy() {
    // destroy player
    if (this.videoPlayer) {
      await this.videoPlayer.stopAllPlayers();
      this.handlerPlay.remove();
      this.handlerPause.remove();
      this.handlerEnded.remove();
      this.handlerReady.remove();
      this.handlerExit.remove();
    }
  }
}
