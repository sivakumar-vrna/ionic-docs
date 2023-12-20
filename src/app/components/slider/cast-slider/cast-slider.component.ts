import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CastDetailsPage } from 'src/app/vrna/pages/cast-details/cast-details.page';
import { ActorPageTvComponent } from 'src/app/vrna/pages/actor-page/actor-page-tv/actor-page-tv.component';

// #importing Swiper core and required modules
import SwiperCore, { SwiperOptions, Navigation, Pagination, A11y } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

// #installing Swiper modules
SwiperCore.use([Navigation, Pagination, A11y]);

@Component({
  selector: 'app-cast-slider',
  templateUrl: './cast-slider.component.html',
  styleUrls: ['./cast-slider.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CastSliderComponent implements OnInit, OnDestroy {

  @Input() castData: any;
  @Input() domainUrl: string;
  @Input() sectionName:string = '';

  public castSliderOptions: SwiperOptions = {
    centeredSlides: false,
    loop: false,
    lazy:true,
    breakpoints: {
      0: {
        slidesPerView: 5.2,
        spaceBetween: 10,
      },
      576: {
        slidesPerView: 7.2,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 7.2,
        spaceBetween: 10,
      },
      992: {
        slidesPerView: 8.2,
        spaceBetween: 10,
      },
      1200: {
        slidesPerView: 9.2,
        spaceBetween: 15,
      },
      1400: {
        slidesPerView: 10.2,
        spaceBetween: 15,
      },
    },
  };

  @ViewChild('castSlider', { static: false }) swiper?: SwiperComponent;

  constructor(
    private router: Router,
    public modalController: ModalController,
  ) { }

  keypressOnCastSlider(event: KeyboardEvent): void {    
    if(event.key == 'ArrowRight'){
      this.swiper?.swiperRef.slideNext();
      let idElemActive = document.activeElement.getAttribute('id');
      let elemPart = idElemActive.split('-');
      let idActiveIndex = parseInt(elemPart[1]);

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

      if( idActiveIndex ==  0){
        event.stopPropagation();
        event.preventDefault();
      }                 
    }
  }

  ngOnInit() {
    console.time('Perf: CompnCastSlider Screen');

    /*
    this.castData?.map(cast => {
      cast['imageUrl'] = this.domainUrl + '/images' + cast.imageUrl;
    });
    */
  }

  ngAfterViewInit() {
    console.timeEnd('Perf: CompnCastSlider Screen');
  }

  onCardClick(e) {
    this.castDetailModal(e.castId);
  }

  async castDetailModal(id: number) {
    const params = {
      id: id
    };
  }

  async onCastDetail(cast) {
    if(cast.castId === 934){
      this.router.navigate(['/actor-page-tv/actor-page'], { state: { castData: cast } });
    }else{
      const modal = await this.modalController.create({
        component: CastDetailsPage,
        cssClass: 'cast-popup-modal',      
        componentProps: {
          'cast': cast,
        }
      });
      await modal.present();
  
      const { role } = await modal.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
    }
    }

  ngOnDestroy() {}

}
