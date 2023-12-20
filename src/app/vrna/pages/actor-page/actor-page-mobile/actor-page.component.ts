import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { isPlatform, ModalController } from '@ionic/angular';
import { CastService } from 'src/app/shared/services/cast/cast.service';
import { environment } from 'src/environments/environment';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-actor-page',
  templateUrl: './actor-page.component.html',
  styleUrls: ['./actor-page.component.scss'],
})
export class ActorPageMobileComponent implements OnInit,AfterViewInit {

  @Input() cast: any;
  castMoviesData: any;
  domainUrl: string;
  isExpanded = false;
  isCarrierExpanded=false;
  trailerUrl: string;
  mimetype: string;
  activeSlideIndex: number = 0; 
  customCarouselCss: string = 'pc-img-actor-movies'; 
  isActorPage: boolean = true;


  
  suggestionOptions: SwiperOptions = {
    centeredSlides: false,
    loop: false,
    breakpoints: {
      0: {
        slidesPerView: 2.1,
        spaceBetween: 10,
      },
      576: {
        slidesPerView: 2.2,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 2.2,
        spaceBetween: 10,
      },
      992: {
        slidesPerView: 2.1,
        spaceBetween: 10,
      },
      1200: {
        slidesPerView: 3.1,
        spaceBetween: 15,
      },
      1400: {
        slidesPerView: 3.1,
        spaceBetween: 15,
      },
    },
  };

  constructor(
    private castMovies: CastService,
    public modalController: ModalController,
  ) {}

   @ViewChild('swiper') swiper: SwiperComponent;
   swiperTrailers: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true, 
    },
  };
  
  @ViewChild('trailerVideo') trailerVideo: ElementRef;
  private videoPlayer: HTMLVideoElement;
  isVideoPlaying = false;

  playVideo(video: HTMLVideoElement) {
    if (this.isVideoPlaying) {
      video.pause();
      this.isVideoPlaying = true;
    } else {
      video.play();
      this.isVideoPlaying = false;

    }
    this.isVideoPlaying = !this.isVideoPlaying;
  }

   async ngOnInit() {
    if (isPlatform('capacitor')) {
      this.domainUrl = environment.capaciorUrl;
    } else {
      this.domainUrl = (window as any).location.origin;
    }

    (await this.castMovies.onCastMovies(this.cast.castId)).subscribe(res => {
      if (res.status.toLowerCase() === 'success' && res.statusCode === '200') {
        const tempData: any = res.data;
        tempData['tempData'] = this.domainUrl + '/images' + tempData.tempData;
        this.castMoviesData = tempData;
        this.castMoviesData.map(cast => cast['posterurl'] = this.domainUrl + '/images' + cast.posterurl);
        this.activeSlideIndex = 0; 

        if (this.castMoviesData && this.castMoviesData.length > 0) {
          this.trailerUrl = this.domainUrl + '/' + this.castMoviesData[0].trailerurl;
          this.videoPlayer = this.trailerVideo.nativeElement;
          this.videoPlayer.addEventListener('ended', () => {
            this.isVideoPlaying = false;
          });
        }
      }
    });
  }
  ngAfterViewInit() {
    this.swiperTrailers = {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    };
    this.swiper.swiperRef.on('slideChange', () => {
      const videos = this.swiper.swiperRef.el.querySelectorAll('video');
      videos.forEach((video: HTMLVideoElement) => {
        if (this.isVideoPlaying) {
          video.pause();
          video.currentTime = 0;
        }
      });
      this.isVideoPlaying = false;
    });
  }
  
  goToSlide(index: number) {
    this.swiper.swiperRef.slideTo(index); 
  }
  
  toggleDescription() {
    this.isExpanded = !this.isExpanded;
  }

  toggleCarrier(){
    this.isCarrierExpanded = !this.isCarrierExpanded;
  }
  
  doRefresh(event) {
    this.castMovies;
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
  
  dismiss() {
    if (this.isVideoPlaying) {
      const video: HTMLVideoElement = this.trailerVideo.nativeElement;
      video.pause();
      this.isVideoPlaying = false;
    }
    
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
  

