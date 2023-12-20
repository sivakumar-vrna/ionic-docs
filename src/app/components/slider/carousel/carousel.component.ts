import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

// #importing Swiper core and required modules
import  SwiperCore, { SwiperOptions, Navigation, Pagination, A11y } from 'swiper';
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
  @Input() sectionName: string = '';
  @Input() movieId: number = 0;
  @Input() uniquePageId:any = 0;
  @Input() isActorPage: boolean = false; 

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
        slidesPerView: 4.2,
        spaceBetween: 10,
      },
      992: {
        slidesPerView: 5.2,
        spaceBetween: 10,
      },
      1200: {
        slidesPerView: 5.5,
        spaceBetween: 10,
      },
      1400: {
        slidesPerView: 6.3,
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

  onCardFocus(sectionName, uniquePageId=0){
    this.swiper?.swiperRef.slideTo(this.swiper?.swiperRef.activeIndex);
    let firstCardId = document.getElementById(sectionName+'-'+this.swiper?.swiperRef.activeIndex+'_'+uniquePageId);
    firstCardId.focus();
  }

  ngOnInit() {
    console.time('Perf: CompnCarouselBanner Screen');
  }

  ngAfterViewInit() {
    console.timeEnd('Perf: CompnCarouselBanner Screen');
    let elem_id = this.sectionName+'_carouselSwiper';
    const swiper_div = document.getElementById(elem_id);
    // swiper_div.style.height = 'auto';
 }

  keypressOnCarousel(event: KeyboardEvent): void {    
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

      let numLastCard = this.carouselData.length-1;

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

      //focus the next card
      let elem = document.getElementById(this.sectionName+'-'+(idActiveIndex-1)+'_'+this.uniquePageId);
      if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }

      if( idActiveIndex ==  0){
        event.stopPropagation();
        event.preventDefault();
      }
    }   

  }

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
