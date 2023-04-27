import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

// #importing Swiper core and required modules
import SwiperCore, { SwiperOptions, Navigation, Pagination, A11y } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

// #installing Swiper modules
SwiperCore.use([Navigation, Pagination, A11y]);

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CarouselComponent implements OnInit, OnDestroy {

  @Input() carouselData: any;
  @Input() domainUrl: string;
  @Input() continuewatching: boolean = false;
  @Input() public carouselOptions: SwiperOptions = {
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
        slidesPerView: 4.5,
        spaceBetween: 10,
      },
      1400: {
        slidesPerView: 5.3,
        spaceBetween: 10,
      },
    },
  };

  continueWatchOption: SwiperOptions = {
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
        slidesPerView: 3.1,
        spaceBetween: 10,
      },
      992: {
        slidesPerView: 3.1,
        spaceBetween: 10,
      },
      1200: {
        slidesPerView: 3.2,
        spaceBetween: 10,
      },
      1400: {
        slidesPerView: 4.1,
        spaceBetween: 10,
      },
    },
  };

  @ViewChild('carousel', { static: false }) swiper?: SwiperComponent;

  constructor(private router: Router) { }

  ngOnInit() { }

  onCardClick(e) {
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

  ngOnDestroy() {

  }
}
