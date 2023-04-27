import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CastDetailsPage } from 'src/app/vrna/pages/cast-details/cast-details.page';

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

  public castSliderOptions: SwiperOptions = {
    centeredSlides: false,
    loop: false,
    breakpoints: {
      0: {
        slidesPerView: 2.1,
        spaceBetween: 10,
      },
      576: {
        slidesPerView: 3.2,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 3.2,
        spaceBetween: 10,
      },
      992: {
        slidesPerView: 4.2,
        spaceBetween: 10,
      },
      1200: {
        slidesPerView: 4.2,
        spaceBetween: 15,
      },
      1400: {
        slidesPerView: 5.2,
        spaceBetween: 15,
      },
    },
  };

  @ViewChild('castSlider', { static: false }) swiper?: SwiperComponent;

  constructor(
    private router: Router,
    public modalController: ModalController,
  ) { }

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

  ngOnDestroy() {

  }

}
