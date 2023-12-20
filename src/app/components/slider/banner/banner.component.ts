import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild,
  ChangeDetectorRef, ViewEncapsulation,} from '@angular/core';
import { Router } from '@angular/router';

// #importing Swiper core and required modules
import SwiperCore, { Virtual, SwiperOptions, Navigation, Pagination, A11y } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { PlayerService } from '../../player/service/player.service';
import videojs from 'video.js';
import 'videojs-contrib-quality-levels';
import 'videojs-hls-quality-selector';
import 'video.js/dist/video-js.css';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import { MatDialog } from '@angular/material/dialog';
import { ModalController, isPlatform } from '@ionic/angular';
import { FilterDetailsPage } from 'src/app/vrna/pages/filter-details/filter-details.page';
import { Platform } from '@ionic/angular';
import { GENRES_KEY } from 'src/app/vrna/services/ui-orchestration/orch.service';
import { environment } from 'src/environments/environment';
import { Storage } from '@capacitor/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { fromEvent } from 'rxjs';

SwiperCore.use([Virtual, Navigation, Pagination, A11y]);

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BannerComponent implements OnInit, AfterViewInit {

  @ViewChild('bannerMain', {static: false})
  private bannerMain: ElementRef<HTMLDivElement>;
  isTestDivScrolledIntoView: boolean;

  @Input() trailerurl: string;
  
  domainUrl: string;
  isHovered: boolean = false;
  hoveredBanner: any = null;
  public generes: any;
  selectedBanner: any ;
  currentBannerIndex: number = -1;
  bannerWidth: number;
  bannerHeight: number;
  idPrevVideoElement: any;
  previousPlayer:any;
  muteStates: boolean[] = [];
  isMouseOverBanner = false;
  genres: any;
  genre: any;
  banner_loaded: boolean = false;
  banner_images_loaded: boolean = false;
  playerHtml:any[] = [''];
  player:any;
  @Input() btnPausevideo: boolean = false;
  firstUnmuteDone: boolean = false;
  hideOrShowMuteWarning: string = 'hide';

  @Input() bannerData: any[] = [
    {
      moviebannerurl: 'assets/images/placeholder-banner.webp'
    },
    {
      moviebannerurl: 'assets/images/placeholder-banner.webp'
    },
    {
      moviebannerurl: 'assets/images/placeholder-banner.webp'
    }
  ];
  
  showBanner = false;
  placeholder = 'assets/images/placeholder-banner.webp';
  
    config: SwiperOptions = {
    centeredSlides: true, 
    preloadImages: true,
    loop: false,
    loopedSlides: 0,
    navigation: true,
    pagination:true,  
    lazy:true,
    virtual: false,
    speed: 1000,
    /*breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: true,
      },
      576: {
        slidesPerView: 1.1,
        spaceBetween: 10,
        pagination: true,
      },
      768: {
        slidesPerView: 1.1,
        spaceBetween: 15,
        pagination: true,
      },
      992: {
        slidesPerView: 1.1,
        spaceBetween: 15,
        pagination: true,
      },
      1200: {
        slidesPerView: 1.2,
        spaceBetween: 20,
      },
      1400: {
        slidesPerView: 1.4,
        spaceBetween: 30,
      }
    }*/
  };
  genreConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 0,
  };
  
  @ViewChild('bannerSwiper', { static: false }) swiper?: SwiperComponent;
  @ViewChild('target', { static: false }) target: ElementRef;
  @ViewChild('targetElement', { static: false }) targetElement: ElementRef;
  @ViewChild(SwiperComponent, { static: false }) swiperDirective?: SwiperComponent;
  @ViewChild('swiperRef') swiperRef: any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    public  modalController: ModalController,
    private playerService: PlayerService,
    private platform:Platform,
    private sanitized: DomSanitizer,
    private chRef: ChangeDetectorRef
  ) { } 
  
  //on web, some browser do not supports video playing unmuted; 
  //so unmute video on document click, keydown
  @HostListener('document:click', ['$event'])
  onMouseClick(e) {    
    if(!this.firstUnmuteDone){
      this.player.muted(false);
      this.firstUnmuteDone = true;
      this.hideOrShowMuteWarning = 'hide';
    }
  }
  @HostListener( 'window:keydown', [ '$event' ] )
  onKeydown(event: KeyboardEvent) { 
    if(!this.firstUnmuteDone){
      this.player.muted(false);
      this.firstUnmuteDone = true;
      this.hideOrShowMuteWarning = 'hide';
    }
  }
  
  async ngOnInit() {
    if (isPlatform('capacitor')) {
      this.domainUrl = environment.capaciorUrl;
    } else {
      this.domainUrl = (window as any).location.origin;
    }
    const tempData = await Storage.get({ key: GENRES_KEY });
    this.genres = JSON.parse(tempData.value);
    console.log(this.genres);    
  }

  handleKeyboardEvent(event: KeyboardEvent): void {    
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      this.pausePlayer();

      //if on last banner, slide to first
      const activeIndex = this.swiper?.swiperRef.activeIndex;
      if(activeIndex == (this.bannerData.length - 1)){
        this.swiper?.swiperRef.slideTo(0);
      }else{
        this.swiper?.swiperRef.slideNext();
      }
      //...

      event.preventDefault();
    }
    if(event.key == 'ArrowLeft'){
      event.stopPropagation();
      this.pausePlayer();

      //if on first banner, slide to last
      const activeIndex = this.swiper?.swiperRef.activeIndex;
      if(activeIndex == 0){
        this.swiper?.swiperRef.slideTo((this.bannerData.length - 1));
      }else{
        this.swiper?.swiperRef.slidePrev();
      }
      //...

      event.preventDefault();
    }

    if(event.key == 'Enter'){
      event.stopPropagation();
      let activeIndex = this.swiper?.swiperRef.activeIndex;
      this.onPlayerClick(activeIndex);
      event.preventDefault();
    }
    
    if(event.key == 'ArrowUp'){
      let activeIndex = this.swiper?.swiperRef.activeIndex-1;
      let ctaBtnElem = document.getElementById('id_cta_btn_'+activeIndex);
      if(document.activeElement !== ctaBtnElem){
        let btnMnuElem = document.getElementById('btnMnu');
        event.stopPropagation();
        btnMnuElem.focus();
        event.preventDefault();
      }      
    }
  }

  _visibilityChangeHandler(status: string){

    if(status == 'HIDDEN'){
      if(this.player){
        if(!this.player.paused()){
          this.player.pause();
        }
      }
    }

    /*

    if(status == 'VISIBLE'){
      if(this.player){
        if(this.player.paused()){
          this.player.play();
        }
      }
    }
    
    */

  }
    

  private playVideoForActiveSlide() {
    const activeSlideIndex = this.swiper?.swiperRef?.activeIndex;
    const videoElements = document.getElementsByClassName('video-js');
    Array.from(videoElements).forEach((videoElement: HTMLVideoElement, idx: number) => {
      const player = videojs(videoElement);
      if (idx === activeSlideIndex) {
        if (player.paused()) {
          player.play();          
        }
      }
    });
  }

  private pauseVideoForActiveSlide() {
    const activeSlideIndex = this.swiper?.swiperRef?.activeIndex;
    const videoElements = document.getElementsByClassName('video-js');
    Array.from(videoElements).forEach((videoElement: HTMLVideoElement, idx: number) => {
      const player = videojs(videoElement);
      if (idx === activeSlideIndex) {
        // Check if the player is playing before pausing
        if (!player.paused()) {
          player.pause();
          player.currentTime(0);
        }
      }
    });
  }  

  ngAfterViewInit() {

    
    
    let elem = document.getElementsByClassName('swiper-button-prev')[0] as HTMLElement;
    if(elem){
      elem.style.visibility = 'hidden';
    }

    elem = document.getElementsByClassName('swiper-button-next')[0] as HTMLElement;
    if(elem){
      elem.style.visibility = 'hidden';
    }

    
    

    console.timeEnd('Perf: CompnSliderBanner Screen');
  }  
  
  private setVideoDisplay(index: number, display: string) {
    const videoElement = document.getElementById('vs-player-' + index) as HTMLVideoElement;
    if (videoElement) {
      videoElement.style.display = display;
    }
  }

  private handleVideoEnded(index: number) {
    const videoElement = document.getElementById('vs-player-' + index) as HTMLVideoElement;
    const playButton = document.getElementById('play-' + index) as HTMLElement;
  
    videoElement.style.display = 'block'; 
    playButton.classList.remove('hidden'); 
  }

  onSwiperInit(swiper: any){  
    this.banner_loaded = true;

    
    
    let elem = document.getElementsByClassName('swiper-button-prev')[0] as HTMLElement;
    if(elem){
      elem.style.visibility = 'hidden';
    }

    elem = document.getElementsByClassName('swiper-button-next')[0] as HTMLElement;
    if(elem){
      elem.style.visibility = 'hidden';
    }

    
    

    elem = document.getElementById('bannerMain');
    if(elem){
      elem.focus();
    }

  }

  /*
   * First banner will be loaded as soon as the swiper loaded fully.
   */
  onSwiperImagesReady(swiper: any, banner: any, btnPausevideo:any){

    this.banner_images_loaded = true; 
    //this.config.loopedSlides = this.bannerData.length;
    //const activeSlideIndex = swiper?.swiperRef.activeIndex;
    const activeSlideIndex = 0;

    let autoplay = true;
    if(btnPausevideo){
      autoplay = false;
    }    

    try{

      let options = {
        responsive: false,
        autoplay: autoplay,
        sources: {
            src: this.playerService.trailerBaseUrl+'/'+banner.trailerurl,
            type: banner.trailerurl.endsWith('.mp4') ? 'video/mp4' : 'application/x-mpegURL',
        }
      };

      let html = '<video poster="'+ banner.moviebannerurl +'" class="video-js vjs-default-button vjs-big-play-centered trailer" onclick="onPlayerClick('+activeSlideIndex+')" allow="autoplay" id="vs-player-'+ activeSlideIndex +'" playsinline preload="none"></video>';
      if(autoplay){
        html = '<video poster="'+ banner.moviebannerurl +'" class="video-js vjs-default-button vjs-big-play-centered trailer" onclick="onPlayerClick('+activeSlideIndex+')" allow="autoplay" autoplay id="vs-player-'+ activeSlideIndex +'" playsinline preload="none"></video>';
      }

      this.playerHtml[activeSlideIndex] = this.sanitized.bypassSecurityTrustHtml(html);
      let elem = document.getElementsByClassName('swiper-button-prev')[0] as HTMLElement;
      elem.style.visibility = 'visible';
      elem = document.getElementsByClassName('swiper-button-next')[0] as HTMLElement;
      elem.style.visibility = 'visible';
      this.chRef.detectChanges();

      this.player = videojs('vs-player-'+activeSlideIndex, options);
      const divPlayer = document.getElementById('divPlayer-'+activeSlideIndex);
      const divImgPlayer = document.getElementById('divImgPlayer-'+activeSlideIndex);
      
      this.player.on('play', () => {
        divPlayer.style.opacity = '';
        divImgPlayer.style.opacity = '1';                                 
      });
      this.player.on('pause', () => { 
        divImgPlayer.style.opacity = '0';
      });
      this.player.on('ended', () => {
        divImgPlayer.style.opacity = '0';
        this.swiper?.swiperRef.slideNext();
      });      

      this.sleep(100);
      this.player.ready(function() {
        
        divPlayer.style.opacity = '';
        divImgPlayer.style.opacity = '1';

        if(!btnPausevideo){
          try{      
            var promise = this.play();
            if (promise !== undefined) {
              promise.then(_ => {
                // Autoplay started!
              }).catch(error => {
                // Autoplay not allowed! Mute video and try to play again
                this.muted(true);
                this.play();
              });
            }
          }catch(err){
            this.muted(true);
            this.play();
          }              
        }
      });

      //if video muted show an message to press any key to unmute      
      setTimeout(() => {
        try{
          let muted = this.player.muted();
          if(muted){
            this.hideOrShowMuteWarning = 'show';
            this.chRef.detectChanges();
          }   
        } catch(err){
          console.log(err);
        }    
      }, 1000);

    }catch(error){
      //alert(error);
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  temp(){
    alert('temp');
  }


  onSwiper(swiper: any,banner:any) {
    
    //this.config.loopedSlides = this.bannerData.length;

    swiper.on('slideChangeTransitionStart', () => {

      //pause the player whle sliding
      this.player.pause();          

      var previousIndex = swiper.previousIndex - 1;
      if(previousIndex == -1){
        previousIndex = 0;
      }

      var divPlayerPrev = document.getElementById('divPlayer-'+previousIndex);
      var divImgPlayerPrev = document.getElementById('divImgPlayer-'+previousIndex);
      divPlayerPrev.style.opacity = '0';
      divImgPlayerPrev.style.opacity = '1';

      var curIndex = swiper.activeIndex;
      var divPlayerCur = document.getElementById('divPlayer-'+curIndex);
      var divImgPlayerCur = document.getElementById('divImgPlayer-'+curIndex);
      divPlayerCur.style.opacity = '0';
      divImgPlayerCur.style.opacity = '1';
      
      this.chRef.detectChanges();     

    });

    swiper.on('slideChangeTransitionEnd', () => {   
      
      //var activeSlideIndex = swiper.activeIndex-1;
      var activeSlideIndex = swiper.activeIndex;
      const divPlayer = document.getElementById('divPlayer-'+activeSlideIndex);
      const divImgPlayer = document.getElementById('divImgPlayer-'+activeSlideIndex);
      
      divPlayer.style.opacity = '0';
      divImgPlayer.style.opacity = '1';

      //dispose all players      
      const players = videojs.getAllPlayers();
      players.forEach(function (player) {        
        player.dispose();
      });
      this.playerHtml = [''];

      let options = {
        autoplay: true,
        sources: {
            src: this.playerService.trailerBaseUrl + '/' + this.bannerData[activeSlideIndex].trailerurl,
            type: this.bannerData[activeSlideIndex].trailerurl.endsWith('.mp4') ? 'video/mp4' : 'application/x-mpegURL',
        }        
      };

      let html = '<video poster="'+ this.bannerData[activeSlideIndex].moviebannerurl +'" onclick="onPlayerClick('+activeSlideIndex+')" class="video-js vjs-default-button vjs-big-play-centered trailer" allow="autoplay" autoplay id="vs-player-'+ activeSlideIndex +'" playsinline preload="none"></video>';
      html = html+'';
      this.playerHtml[activeSlideIndex] = this.sanitized.bypassSecurityTrustHtml(html);
      this.chRef.detectChanges();

      this.sleep(100);  //have the banner in display for 100 ms before the triler plays.
      this.player = videojs('vs-player-'+activeSlideIndex, options);

      this.player.ready(function() {

        this.play();

        this.on('play', () => {
          divPlayer.style.opacity = '';
          divImgPlayer.style.opacity = '1';
        });
        this.on('pause', () => { 
          divImgPlayer.style.opacity = '0';
        });
        this.on('ended', () => {
          divImgPlayer.style.opacity = '0';
          this.swiper?.swiperRef.slideNext();
        });

      });
      
    });
  }
  
  onPlayTrailer(banner: any, index: number) {

    if(this.player)
    {
      if(this.player.paused()){
        this.player.play();
      }else{
        this.player.pause();
      }
    }

    return true;
  }
  
  onPlayerClick(index: number) {

    /*
    const banner = this.bannerData[index];
    this.onBannerDetails(banner);
    */

    if(this.player){
      if(this.player.paused()){
        this.player.play();
      }else {
        this.player.pause();
      }
    }

  }

playVideo(player: any) {
  if (player.paused()) {
    player.play();
  }
}
pauseVideo(player: any) {
  if (!player.paused()) {
    player.pause();
  }
}
  
  toggleMute(index: number) {
    this.muteStates[index] = !this.muteStates[index];
    const videoPlayer = videojs(`vs-player-${index}`);
    videoPlayer.muted(this.muteStates[index]);
  }

  getMuteIcon(index: number) {
    return this.muteStates[index] ? 'volume-mute' : 'volume-high';
  }

  onBannerDetails(e) {

    if(this.player){
      this.player.pause();
    }       
    this.movieDetailModal(e.movieId);
  }

  async movieDetailModal(id: number) {
    const params = {
      id: id
    };
    this.router.navigate(['/home'], { queryParams: params });
  }

  trackItems(index: number, itemObject: any) {
    return itemObject.movieId;
  }

  onActionClick(item) {
    console.log('teazDn')
    this.openDialog(item)
  }

  openDialog(item) {
    this.router.navigate([`/view-category/featured`])
  }

  async openIonModal(data) {

    const modal = await this.modalController.create({
      component: FilterDetailsPage,
      cssClass: 'movie-details-modal',
      componentProps: {
        'model_title': data.genreDesc,
        'data': data,
        'type': 'genre'
      },
    });
    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        console.log('Modal Data : ' + modelData.data);
      }
    });
    return await modal.present();
  }

  onSubtitleButtonClick(banner: any, index: number)  {
    const videoPlayer = videojs(`vs-player-${index}`);
    const subtitles = banner.subtitles;
    const subtitleButton = document.getElementById(`subtitle-button-${index}`);
    const subtitlesAvailable = subtitles && subtitles.length > 0;
    if (subtitlesAvailable) {
      const enabledSubtitles = videoPlayer.textTracks().tracks_.filter((track: any) => track.mode === 'showing');
      if (enabledSubtitles.length > 0) {
        enabledSubtitles.forEach((track: any) => {
          track.mode = 'disabled';
        });
      } else {
        const track = videoPlayer.textTracks().tracks_[0];
        if (track) {
          track.mode = 'showing';
        }
      }
    } else {
      const tracks = videoPlayer.textTracks();
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].mode = 'disabled';
      }
    }
    if (subtitleButton) {
      if (subtitlesAvailable) {
        subtitleButton.style.opacity = '1';
      } else {
        subtitleButton.style.opacity = '0.5';
      }
    }
  }

  pausePlayer(){
    try{
      if(this.player){
        this.player.pause();
      }
    } catch(err){
      console.log(err);
    }
  }
  
    


}









