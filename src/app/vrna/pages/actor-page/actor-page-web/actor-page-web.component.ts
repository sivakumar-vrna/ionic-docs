  import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
  import { Router } from '@angular/router';
  import { ModalController, isPlatform } from '@ionic/angular';
  import { CastService } from 'src/app/shared/services/cast/cast.service';
  import { SwiperOptions } from 'swiper';
  import { SwiperComponent } from 'swiper/angular';
  import { environment } from 'src/environments/environment';
  import { ActivatedRoute } from '@angular/router';



  @Component({
    selector: 'app-actor-page-web',
    templateUrl: './actor-page-web.component.html',
    styleUrls: ['./actor-page-web.component.scss'],
  })
  export class ActorPageWebComponent implements OnInit {
    
    castMoviesData: any;
    castData: any;
    domainUrl: string;
    customCarouselCss: string = 'pc-img-actor-movies'; 
    isActorPage: boolean = false;
    trailerUrl: string;
    mimetype: string;
    lastUpdatedDate: string;


    


    //footer
    date = Date();
    public menus = [
      { title: 'Home', url: '/home' },
      { title: 'Featured', url: '/view-category/featured' },
      { title: 'Latest Movies', url: '/view-category/latest'},
      { title: 'Trending Movies', url: '/view-category/trending'},
    ];
    

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
      public  modalController: ModalController,
      private router: Router,
      private route: ActivatedRoute

      ) {}

    async ngOnInit() {
      this.fetchData();
      console.log('Cast Data:', this.castData);



      this.updateLastUpdatedDate();
      if (isPlatform('capacitor')) {
        this.domainUrl = environment.capaciorUrl;
      } else {
        this.domainUrl = (window as any).location.origin;
      }
      (await this.castMovies.onCastMovies(this.castData.castId)).subscribe(res => {
        if (res.status.toLowerCase() === 'success' && res.statusCode === '200') {
          const tempData: any = res.data;
          tempData['tempData'] = this.domainUrl + '/images' + tempData.tempData;
          this.castMoviesData = tempData;
          this.castMoviesData.map(cast => cast['posterurl'] = this.domainUrl + '/images' + cast.posterurl);
          
          
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

    async fetchData() {
      const navigation = this.router.getCurrentNavigation();
      if (navigation && navigation.extras && navigation.extras.state) {
        const castData = navigation.extras.state.castData;
        if (Array.isArray(castData)) {
        } else if (castData) {
          this.castData = castData;
          if (this.castData && this.castData.castId) {
            (await this.castMovies.onCastMovies(this.castData.castId)).subscribe(res => {
            });
          }
        }
      }
    }

      
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
    
    onNavigate(path: string) {
      this.router.navigate([path]);
    }



    //foter depenency
    
    updateLastUpdatedDate() {
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear();
      this.lastUpdatedDate = `[${day}/${month}/${year}]`;
    }

    
    navigate() {
      this.router.navigate(['/terms'])
    }
    doRefresh(event) {
      this.ngOnInit(); 
      setTimeout(() => {
        event.target.complete();
      }, 2000);
    }
    
    dismiss() {
      this.router.navigate(['/']);
    }

  }
