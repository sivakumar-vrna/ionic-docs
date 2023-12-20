import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation, ChangeDetectorRef, HostListener } from '@angular/core';
import { isPlatform, ModalController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
import videojs from 'video.js';
import 'videojs-contrib-quality-levels';
import 'videojs-hls-quality-selector';
import { PlayerService } from './service/player.service';
import { UserService } from 'src/app/shared/services/user.service';
import { WatchlistService } from 'src/app/shared/services/watchlist/watchlist.service';
import { environment } from 'src/environments/environment';
import { HomeService } from 'src/app/vrna/pages/home/home.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from 'src/app/vrna/services/movie/movie.service';
import { CastDetailsPage } from 'src/app/vrna/pages/cast-details/cast-details.page';
import { DomSanitizer } from '@angular/platform-browser';
import { LOCALES_KEY, LOCALE_KEY} from '../../vrna/services/ui-orchestration/orch.service';
import { Storage } from '@capacitor/storage';

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
  @Input() movieId: number;
  @Input() pauseTime: number;
  
  localeData : any;
  languages: string[] = [];
  userId: number;
  player: videojs.Player; // Player invoked as variable
  currentTime: number; // get current time of video playing
  continueWatchTime: number; // get the time while player is paused or closed
  loading: any;
  showCustomCard: boolean = false; 
  introVideoPlayed: boolean = false;
  subtitlesEnabled = true; 
  casts: any;
  myAudio: any;
  audioTracks: any;
  isLoading = true;
  private introVideoSkipped = false;
  playerHtml:any;
  message: string = ''; 
  showMessage: boolean = false; 
  overlayVisible:boolean =false;
  private inactivityTimer: any;
  private inactivityDuration: number = 20000;
  
  refreshVideo = () => {
    
    if (this.player) {
      this.player.currentTime(0);
      this.InactivityTimer(); 
    }
  };

  skipForward = () => {
    if (this.player) {
      const currentTime = this.player.currentTime();
      const newTime = currentTime + 10;
      this.player.currentTime(newTime);
      this.InactivityTimer(); 
      
      this.message = 'Skipping forward 10 seconds...';
      this.showMessage = true;

      setTimeout(() => {
        this.showMessage = false;
      }, 2000); 
    }
};

  playFromBeginning = () => {
    if (this.player) {
      this.player.currentTime(0);
      this.player.play();
      this.showCustomCard = false;
      this.InactivityTimer(); 
    }
  };
  
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
    private watchlistService: WatchlistService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private movieService: MovieService,
    private sanitized: DomSanitizer,
    private chRef: ChangeDetectorRef,    
    private continueWatching: PlayerService,        

  ) {
    this.screenLandscape();
    this.InactivityTimer();
  }

  private InactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    if (this.player && this.player.paused()) {
      this.inactivityTimer = setTimeout(() => {
        this.overlayVisible = true;
      }, this.inactivityDuration);
    } else {
      this.overlayVisible = false;
    }
  }
  @HostListener('document:mousemove')
  @HostListener('document:keydown', ['$event'])
  @HostListener('document:keyup', ['$event'])
  @HostListener('document:keyright', ['$event'])
  @HostListener('document:keyleft', ['$event'])
  @HostListener('document:touchstart')
  OnUserActivity(event: MouseEvent | KeyboardEvent | TouchEvent) {
    if (!(event instanceof KeyboardEvent) || (event as KeyboardEvent).key !== 'Enter') {
      clearTimeout(this.inactivityTimer);
      if (this.player && this.player.paused()) {
        this.overlayVisible = false;
        this.InactivityTimer();
      } else {
        this.overlayVisible = false;
      }
    }
  }
    private ControlBarEventListeners() {
      if (this.player) {
        const controlBar = this.player.controlBar;
    
        if (controlBar) {
          controlBar.on('useractive', () => {
            clearTimeout(this.inactivityTimer);
            this.overlayVisible = false;
          });
    
          controlBar.on('userinactive', () => {
            this.overlayVisible = true;
          });
    
          if (controlBar.el()) {
            controlBar.el().addEventListener('click', () => {
              clearTimeout(this.inactivityTimer);
              this.overlayVisible = false;
              this.InactivityTimer();
            });
          }
        }
      }
    }
    handleKeyboardEvent(event: KeyboardEvent): void {
    
    /*
    if(event.key == 'Enter' || event.keyCode == 179){ //play or pause
      event.stopPropagation();
      if(this.player.paused()){
        this.player.play();
      }else{
        this.player.pause();
      }
      event.preventDefault();
    }*/

    if(this.player.paused()){
      if (event.key === 'ArrowRight') {
      const volumeButton = document.querySelector('.vjs-volume-button')as HTMLElement;
      if (volumeButton) {
          volumeButton.focus();
        }
      }

      if(event.key == 'ArrowUp'){ //play or pause
        event.stopPropagation();
        const elem = document.getElementById('btnFF');
        if(elem){
          elem.focus();
        }      
        event.preventDefault();
      }    

      if(event.key == 'ArrowDown' || event.key == 'ArrowRight'){ //play or pause
        event.stopPropagation();
        const elem = document.getElementsByClassName('vjs-control')[0] as HTMLElement;
        if(elem){
          elem.focus();
        }
        this.onPlayerFocus();
        event.preventDefault();
      }
    }    

    /*

    if(event.keyCode == 227){ //rewind or skip backwards
      //event.stopPropagation();
      //..
      //event.preventDefault();
    }    
    if(event.keyCode == 228){ //fast forward
      //event.stopPropagation();
      //..
      //event.preventDefault();            
    }
    if(event.keyCode == 4){ // back button is pressed
      event.stopPropagation();
      this.goBack();
      event.preventDefault();            
    }
    */
  }

  keyFocusOnPlayer(event: KeyboardEvent): void {
    if(this.player.paused()){
      this.player.play();
    }
  }

  keypressOnFastForward(event: KeyboardEvent): void {    
    if(event.key == 'ArrowRight' || event.key == 'ArrowDown'){
      event.stopPropagation();
      const elem = document.getElementById('vs-player-single');
      if(elem){
        elem.focus();
      }
      this.onPlayerFocus();
      event.preventDefault();            
    }
  }

  onPlayerFocus(){
    this.player.controls(true);
    if(this.player.paused()){
      this.player.play();
    }
  }

  async ngOnInit() {  

    
    const localesDataString = (await Storage.get({ key: LOCALES_KEY }))?.value;
    
    this.localeData = JSON.parse(localesDataString);
    //pause all players if exist on somewhere..
    const players = videojs.getAllPlayers();
    players.forEach(function (player) {
      if(!player.paused()){
        player.pause();
      }
    });    
    const loading = await this.loadingController.create({
      cssClass: 'player-loader',
      message: 'Please wait...',
    });
    await loading.present();

    try{     

      let html = '<video id="vs-player-single" class="video-js vjs-default-button vjs-big-play-centered" controls playsinline preload="auto"></video>';
      this.playerHtml = this.sanitized.bypassSecurityTrustHtml(html);
      this.chRef.detectChanges();

      //const token = await this.userService.getCurrentToken();      


      setTimeout(() => {
        try{
          this.player = videojs('vs-player-single', this.options);
          this.ControlBarEventListeners();
          this.BrandName();
          this.player.autoplay(true);
          this.player.muted(true);
          this.player.breakpoints(30);
          this.player.aspectRatio("16:9");          
          this.player.responsive(true);
          this.player.fluid(true);          
          loading.dismiss();

          this.player.on('error', () => {
            console.log(this.player.error);
          });          

          /*const domain = this.domainUrl+'/';
          videojs.Vhs.xhr.beforeRequest = (options) => {
            options.headers = {
              method: 'GET',
              'Access-Control-Allow-Origin': domain,
              //Authorization: token,
              securityKey: this.playerService.cookie$
            };
            return options;
          };
      
          this.player = videojs('vs-player-single', this.options, async function onPlayerReady() {
      
          });*/
                    

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
            this.onPlay(this.currentTime);             
            if (isPlatform('capacitor')) {
              // this.player.requestFullscreen();
            }
            let elem = document.getElementById('playerCustControl');
            if(elem){
              elem.style.visibility = 'hidden';
            }
          });
      
          this.player.on('pause', () => {
            let elem = document.getElementById('playerCustControl');
            if(elem){
              elem.style.visibility = 'visible';
            }
            if(!this.isTrailer){
              this.onPause();
            }              
          });          

          setTimeout(() => {
            const elem = document.getElementById('vs-player-single');
            if(elem){
              elem.focus();
            }
            this.onPlayerFocus();
          }, 2000);         

          
        
        }catch(err){
          loading.dismiss();
          alert(err);          
        }
      }, 500);

    }catch(error){
      alert(error);
    }
    this.onPlay(this.currentTime);
    this.userId = await this.userService.getUserId();
    console.log('Desired currentTime:', this.currentTime);
    this.getMovieCast();
  }
  
  BrandName(){
    const controlBar = this.player?.controlBar;
    if (controlBar) {

      const brandNameElement = document.createElement('div');

      brandNameElement.className = 'vjs-brand-name'; 
      brandNameElement.innerText = 'VRNA'; 

      const fullScreenButton = controlBar.getChild('fullscreenToggle');
  
      if (fullScreenButton) {
        const container = document.createElement('div');
        container.className = 'Vrna-name-container';
        container.appendChild(brandNameElement);
        controlBar.el().insertBefore(container, fullScreenButton.el());
      }
    }
  }
  
  async getMovieCast() {
    (await this.movieService.getMovieCasts(this.contentData.movieId)).subscribe(async response => {
      if (response.status.toLowerCase() === 'success' && response.statusCode == 200) {
        this.casts = response.data;
        this.casts.map(cast => cast['imageUrl'] = this.domainUrl + '/images' + cast.imageUrl)
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    });
  }

  async onCastDetail(cast) {
    const modal = await this.modalController.create({
      component: CastDetailsPage,
      cssClass: 'movie-details-modal',
      componentProps: {
        'cast': cast,
      }
    });
    await modal.present();

    const { role } = await modal.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);

  }


  async ngAfterViewInit() {}

  addButton(name: string, iconName: string, callback: () => void) {
    const div = document.createElement('div');
    div.className = `player-${name}-button-main`;
    div.innerHTML = `<button id="player-${name}-btn"><ion-icon name="${iconName}"></ion-icon></button>`;
  
    const playerClass = document.getElementsByClassName('video-js')[0];
    playerClass.appendChild(div);
  
    const button = document.getElementById(`player-${name}-btn`);
    this.renderer.listen(button, 'click', callback);
  
    if (name === 'beginning') {
      this.renderer.listen(button, 'click', () => {
        this.playFromBeginning(); 
      });
    }
  }

  async onPlay(currentTime) {
    if (!this.isTrailer && !this.introVideoSkipped) {
      this.introVideoSkipped = true;

      if (currentTime !== undefined && currentTime > 0) {

        this.player.currentTime(this.pauseTime);
        console.log('Skipped intro video and set current time:', currentTime);

      } else {

        //angular throws error when playing from local asset; url should be from media.vrnaplex.com
        //this.player.src({ type: 'video/mp4', src: 'https://media.vrnaplex.com/trailer/vrna-intro.mp4'});

        /*
        this.player.on('ended', () => {          
          if (!this.isTrailer) {
            if (!isNaN(currentTime) && isFinite(currentTime)) {
              this.player.currentTime(currentTime);
              this.player.play();
              console.log('Desired current time for main video:', currentTime);
            }
          }
        });
        this.player.play();
        */

      }

    } else {      
      this.showCustomCard = false;   
      this.overlayVisible = false;   
      if (this.continueWatch) {        
        this.onContinueWatch(this.contentData.pauseTime);
        this.continueWatch = false;
      }
    }
     this.InactivityTimer();
    }
async onPause() {
      if (this.player.paused()) { 
      const totalDuration = this.player.duration();
      this.currentTime = this.player.currentTime();

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
        this.showCustomCard = true;
        setTimeout(() => {
          if(this.player.paused()) {
            this.overlayVisible = true;
            this.InactivityTimer();
          }
         },20000);
         (await this.watchlistService.addWatchMovie(data)).subscribe((res) => {
        });
        this.continueWatching.setContinue_update('0');
      }
    }
  }

  async onPlayEnd() {
    // console.log('On play End : ' + this.currentTime);
    const continueDetail = {
      movieId: this.contentData.movieId,
      moviename: this.contentData.moviename,
      userId: this.userId,
      continuewatching: false
    };
    (await this.watchlistService.addWatchMovie(continueDetail)).subscribe((res) => {
    });
  }   


  addAudioTracks() {   
    this.InactivityTimer(); 
    this.myAudio=document.createElement("audio");
    this.myAudio.id="vs-player-single";
    this.myAudio.className="video-js";
    //this.myAudio.setAttribute("controls",true);
    //this.myAudio.setAttribute("visibility","hidden");

    this.audioTracks = this.contentData.audiolanguages;
    if(this.audioTracks != null){
    for(let i=0; i<this.audioTracks.length; i++){
      var value = this.audioTracks[i];  
      var startIndex = value.indexOf("_")+1;  
      var endIndex = value.indexOf(".");  
      var langCode = value.substring(startIndex, endIndex);    
      var desc = "";  
      var locale = this.localeData.find(a => a.code === langCode);      
      if (locale) {
        desc = locale.language;        
      }
      var subs = environment.cloudflareUrl+value;
      console.log("Audio track label>>>>>>>>>>>>>>>>>>>>>>>"+subs);
      var uId = "audio_"+langCode;

      var mySource1=document.createElement("source");
      mySource1.id=uId;
      mySource1.src=subs;
      mySource1.type="audio/ogg";
      this.myAudio.appendChild(mySource1);
      document.body.appendChild(this.myAudio);
      if(!this.player){
        console.log("player is nullllllllllllllllllllllllllllllllllllllllllllllllllllllll");
        this.player = videojs('vs-player-single', this.options);
      }

      var newTrack = new videojs.AudioTrack({
        id: uId,
        kind: 'translation',
        label: desc,
        language: langCode, 
        audio: mySource1     
      });
      this.player.audioTracks().addTrack(newTrack);      
      this.myAudio.play();
    }        
    
    console.log(document.body);
    let tracks = this.player.audioTracks();

    console.log("Audio track Length>>>>>>>>>>>>>>>>>>>>>>>"+tracks.length);
    tracks.addEventListener('change', function handleClick(event) {      
      console.log("Audio track Event listener IN>>>>>>>>>>>>>>>>>>>>>>>");      
      for (let i = 0; i < tracks.length; i++) {
        let track = tracks[i];
        if (track.enabled) {                    
          console.log("Enabled Audio track label>>>>>>>>>>>>>>>>>>>>>>>"+track.id);
          return;
        }
      }
    });

  }
    
    /*if (this.subtitlesEnabled) {
      // Show subtitles
      const subtitleTrack = this.player.addRemoteTextTrack({
        kind: 'subtitles',
        src: subtitle,
        label: 'English', 
        srclang: 'en', 
        default: true 
      }, false); 
  
      subtitleTrack.mode = 'showing';
    } else {
      // Hide subtitles
      const activeSubtitleTrack = this.player.$$('track[default]')[0];
      if (activeSubtitleTrack) {
        activeSubtitleTrack.track.mode = 'disabled';
      }
    }*/
  }  
   
toggleSubtitles() {    
  this.subtitlesEnabled = !this.subtitlesEnabled;  
  this.InactivityTimer(); 
  const subtitle = this.contentData.subtitles;  
  if(subtitle != null){
  for(let i=0; i<subtitle.length; i++){
    var value = subtitle[i];  
    var startIndex = value.indexOf("_")+1;  
    var endIndex = value.indexOf(".");  
    var langCode = value.substring(startIndex, endIndex);    
    var desc = "";  
    var locale = this.localeData.find(a => a.code === langCode);      
    if (locale) {
      desc = locale.language;        
    }
    var subs = environment.cloudflareUrl+value;
    const subtitleTrack = this.player.addRemoteTextTrack({
      kind: 'subtitles',
      src: subs,
      label: desc, 
      srclang: langCode, 
      default: true 
    }, false); 
    subtitleTrack.mode = 'showing';
  }
  }
  

  /*if (this.subtitlesEnabled) {
    // Show subtitles
    const subtitleTrack = this.player.addRemoteTextTrack({
      kind: 'subtitles',
      src: subtitle,
      label: 'English', 
      srclang: 'en', 
      default: true 
    }, false); 

    subtitleTrack.mode = 'showing';
  } else {
    // Hide subtitles
    const activeSubtitleTrack = this.player.$$('track[default]')[0];
    if (activeSubtitleTrack) {
      activeSubtitleTrack.track.mode = 'disabled';
    }
  }*/
}

 onContinueWatch(time: any) {    
    this.player.currentTime(time);
  }

  goBack() {
    if (!this.isTrailer) {
      const movieId = this.contentData.movieId;
      const currentTime = this.player.currentTime();
      console.log('goback:',currentTime);
      const userId = this.userId;
      console.log(userId);
      const movieWatched = JSON.parse(localStorage.getItem('movie_watched')) || {};
      if (!movieWatched[userId]) {
        movieWatched[userId] = {};
      }
      movieWatched[userId][movieId] = Math.round(currentTime);
      localStorage.setItem('movie_watched', JSON.stringify(movieWatched));
    }

    if(this.player){
      this.player.dispose();
      this.playerHtml = '';
      this.chRef.detectChanges();
      this.continueWatching.setContinue_update('1');
    }

    try{
      this.modalController.dismiss();
    }catch(err){
      //alert(err);
    }

    if (isPlatform('capacitor')) {
      screen.orientation.unlock();
    }
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
    
    const userId = this.userId; 
    const movieId = this.contentData.movieId;
  
    const movieWatched = JSON.parse(localStorage.getItem('movie_watched')) || {};
    const storedPlaytime = movieWatched[userId]?.[movieId] || 0;
  
    this.player.currentTime(storedPlaytime);
  
    if (this.contentData?.movieId) {
      await this.onPause();
      await this.homeService.getContinueWatchData();
    }
  }
  
  async ngOnDestroy() {
    //await this.backToState();

    // destroy player
    if (this.player) {
      this.player.dispose();
      this.playerHtml = '';
      //this.chRef.detectChanges();
    }
  }  

  get domainUrl() {
    if (isPlatform('capacitor')) {
      return environment.capaciorUrl;
    } else {
      return (window as any).location.origin;
    }
  }
}