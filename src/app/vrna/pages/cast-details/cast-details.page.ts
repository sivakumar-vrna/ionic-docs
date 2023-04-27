import { Component, Input, OnInit } from '@angular/core';
import { isPlatform, ModalController } from '@ionic/angular';
import { CastService } from 'src/app/shared/services/cast/cast.service';
import { environment } from 'src/environments/environment';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-cast-details',
  templateUrl: './cast-details.page.html',
  styleUrls: ['./cast-details.page.scss'],
})
export class CastDetailsPage implements OnInit {

  @Input() cast: any;
  castMoviesData: any;
  domainUrl: string;
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
  ) { }

  async ngOnInit() {
    if (isPlatform('capacitor')) {
      this.domainUrl = environment.capaciorUrl;
    } else {
      this.domainUrl = window.location.origin;
    }
    (await this.castMovies.onCastMovies(this.cast.castId)).subscribe(res => {
      if (res.status.toLowerCase() === 'success' && res.statusCode === '200') {
        const tempData: any = res.data;
        tempData['tempData'] = this.domainUrl + '/images' + tempData.tempData;
        this.castMoviesData = tempData;
        this.castMoviesData.map(cast => cast['posterurl'] = this.domainUrl + '/images' + cast.posterurl)
        console.log(this.castMoviesData);
      }
    })
    console.log(this.cast)
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
