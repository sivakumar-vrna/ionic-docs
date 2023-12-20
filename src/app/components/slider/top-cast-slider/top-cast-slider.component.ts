import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController,Platform } from '@ionic/angular';
import { ActorPageMobileComponent } from 'src/app/vrna/pages/actor-page/actor-page-mobile/actor-page.component';
import { CastDetailsPage } from 'src/app/vrna/pages/cast-details/cast-details.page';
import { Subscription } from 'rxjs';
import { PlatformService } from 'src/app/vrna/services/platform/platform.service';
import { ChangeDetectorRef } from '@angular/core';
import { ActorPageWebComponent } from 'src/app/vrna/pages/actor-page/actor-page-web/actor-page-web.component';
import { ActorPageTvComponent } from 'src/app/vrna/pages/actor-page/actor-page-tv/actor-page-tv.component';
import { ErrorService } from 'src/app/shared/services/error.service';
import { UserService } from 'src/app/shared/services/user.service';
import { isPlatform } from '@ionic/angular';


// #importing Swiper core and required modules
import SwiperCore, { SwiperOptions, Navigation, Pagination, A11y } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

// #installing Swiper modules
SwiperCore.use([Navigation, Pagination, A11y]);
@Component({
  selector: 'app-top-cast-slider',
  templateUrl: './top-cast-slider.component.html',
  styleUrls: ['./top-cast-slider.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class TopCastSliderComponent implements OnInit, OnDestroy {
  @Input() castData: any;
  @Input() domainUrl: string;
  @Input() sectionName: string;
  @Input() movieId:number;
  @Input() uniquePageId:any;
  casts: any;
  isMobile = false;
  isDesktop = false;
  isTV = false;
  isDevice: boolean;  
  platformSubscription: Subscription;
  
  public castSliderOptions: SwiperOptions = {
    centeredSlides: false,
    loop: false,
    breakpoints: {
      0: {
        slidesPerView: 3.1,
        spaceBetween: 2,
      },
      320: {
        slidesPerView: 3.1,
        spaceBetween: 2,
      },
      576: {
        slidesPerView: 5.1,
        spaceBetween: 2,
      },
      768: {
        slidesPerView: 7.1,
        spaceBetween: 2,
      },
      992: {
        slidesPerView: 9.1,
        spaceBetween: 2,
      },
      1200: {
        slidesPerView: 9.1,
        spaceBetween: 2,
      },
      1400: {
        slidesPerView: 10.1,
        spaceBetween: 2,
      },
    },
  };
  @ViewChild('topCastSlider', { static: false }) swiper?: SwiperComponent;

  constructor(
    private router: Router,
    public modalController: ModalController,
    private errorService: ErrorService,
    private userService: UserService,
    private platform: Platform,
    private platformService: PlatformService,
    private cdr: ChangeDetectorRef 
    ){
      this.isDevice = isPlatform('capacitor') && (window.innerWidth >= 1200 && window.innerHeight >= 800);

      this.platformSubscription = this.platformService.platformStatus$.subscribe((platformStatus) => {
        //alert('Screen width: ' + screen.width + ', Screen height: ' + screen.height);
        // alert('Screen width: ' + screen.width + ', Screen height: ' + screen.height);
        this.isMobile = platformStatus === 'mobile';
        this.isDesktop = platformStatus === 'desktop' || platformStatus === 'tablet' || platformStatus === 'web';
        this.isTV = platformStatus === 'tv';
      });
     }

  ngOnInit() {
    this.castData?.map(cast => {
      cast['imageUrl'] = this.domainUrl + '/images' + cast.imageUrl;
    });
  }

  onCardClick(e) {
    console.log(e);
    this.castDetailModal(e.castId);
  }

  async castDetailModal(id: number) {
    const params = {
      id: id
    };
  }

  keypressOnTopCastSlider(event: KeyboardEvent): void {    
    if(event.key == 'ArrowRight'){
      this.swiper?.swiperRef.slideNext();

      let idElemActive = document.activeElement.getAttribute('id');
      let elemPart = idElemActive.split('-');
      let idActiveIndex = parseInt(elemPart[1]);

      //focus the next card
      let elem = document.getElementById(this.sectionName+'-'+(idActiveIndex+1)+'_'+this.uniquePageId);
      if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }

      //stop right for the last card
      let numLastCard = this.castData.length-1;
      if(numLastCard == idActiveIndex){
        event.stopPropagation();
        event.preventDefault();
      }
    }

    if(event.key == 'ArrowLeft'){
      this.swiper?.swiperRef.slidePrev();    
      
      let idElemActive = document.activeElement.getAttribute('id');
      let elemPart = idElemActive.split('-');
      let idActiveIndex = parseInt(elemPart[1]);

      //focus the prev card
      let elem = document.getElementById(this.sectionName+'-'+(idActiveIndex-1)+'_'+this.uniquePageId);
      if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }

      //stop left for the first card
      if( idActiveIndex ==  0){
        event.stopPropagation();
        event.preventDefault();
      }
    }    
    if(event.key == 'ArrowUp'){
      let elem = document.getElementById('movie_genre-0'+'_'+this.uniquePageId);
      if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }
    }
    if(event.key == 'ArrowDown'){      
      let elem = document.getElementById('cardSuggestions_carouselSwiper_'+this.uniquePageId);
      if(elem){
        event.stopPropagation();
        elem.click();
        event.preventDefault();
      }     
    }    
  }

  onCastFocus(sectionName): void {
      let idElemActive = document.activeElement.getAttribute('id');
      let elemPart = idElemActive.split('-');
      let idActiveIndex = parseInt(elemPart[1]);

      if( idActiveIndex ==  0){
        let elem = document.getElementById(sectionName+'-'+this.swiper?.swiperRef.activeIndex+'_'+this.uniquePageId);
        if(elem){
          elem.focus();
        }else{}
        console.log(sectionName+'-'+this.swiper?.swiperRef.activeIndex+'_'+this.uniquePageId);        
      }

    }
    
    async onCastDetail(cast) {
      //for guest user//
    let userId: any;
    userId = await this.userService.getUserId();
    if(isNaN(userId) || userId == null){
      this.errorService.showAlertMessage('Login Required!', 'Please login to continue.');
      return false;
    }
    if (this.isMobile && cast.castId === 587982) {
        const modal = await this.modalController.create({
        component: ActorPageMobileComponent,
        cssClass: 'movie-details-modal',
        componentProps: {
          'cast': cast,
        }
      });
      await modal.present();
      const { role } = await modal.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
      
    } else if (this.isDesktop && cast.castId === 587982) {
      if (cast) {
        this.router.navigate(['/actor-page-web'], { state: { castData: cast } });
      }  
      this.modalController.dismiss({
        'dismissed': true
      });
    }else if (this.isDevice && window.innerWidth >= 800 && cast.castId === 587982 && this.isTV) {
      this.modalController.dismiss({
        'dismissed': true
      });
      if (cast) {
        this.router.navigate(['/actor-page-tv/actor-page'], { state: { castData: cast } });
      }
    }else {
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
  }

    
  // async onCastDetail(cast){
  //   if (cast) {
  //     this.router.navigate(['/actor-page-web'], { state: { castData: cast } });
  //   }  
  //   this.modalController.dismiss({
  //     'dismissed': true
  //   });
  // }
  
  
   ngOnDestroy() {
    if (this.platformSubscription) {
      this.platformSubscription.unsubscribe();
    }
  }

}
