import { AfterViewChecked, AfterViewInit, Component, Input, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

// #importing Swiper core and required modules
import SwiperCore, { Swiper, Virtual, SwiperOptions, Navigation, Pagination, A11y } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { Dialog } from '@capacitor/dialog';


import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import { MatDialog } from '@angular/material/dialog';
import { ViewCategoryPage } from 'src/app/vrna/pages/view-category/view-category.page';
import { ModalController } from '@ionic/angular';
import { FilterDetailsPage } from 'src/app/vrna/pages/filter-details/filter-details.page';

// #installing Swiper modules
SwiperCore.use([Virtual, Navigation, Pagination, A11y]);

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BannerComponent implements OnInit, AfterViewInit {

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
    loop: true,
    pagination: false,
    navigation: true,
    virtual: {
      addSlidesAfter: 10,
      addSlidesBefore: 10,
      cache: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1.1,
        spaceBetween: 10,
        pagination: false,
      },
      576: {
        slidesPerView: 1.1,
        spaceBetween: 10,
        pagination: false,
      },
      768: {
        slidesPerView: 1.1,
        spaceBetween: 15,
        pagination: false,
      },
      992: {
        slidesPerView: 1.1,
        spaceBetween: 15,
        pagination: false,
      },
      1200: {
        slidesPerView: 1.2,
        spaceBetween: 20,
      },
      1400: {
        slidesPerView: 1.4,
        spaceBetween: 30,
      }
    }
  };

  @ViewChild('bannerSwiper', { static: false }) swiper?: SwiperComponent;

  constructor(private router: Router, private dialog: MatDialog, public modalController: ModalController,) { }
  public generes: any;
  async ngOnInit() {
    console.log(localStorage.getItem('CapacitorStorage.genres'));
    this.generes = JSON.parse(localStorage.getItem('CapacitorStorage.genres'));
    console.log(this.generes)

  }

  ngAfterViewInit() {
    this.showBanner = true;
    console.log("Dom is ready")
    console.log(this.bannerData);
  }

  onBannerClick(e) {
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
    console.log(item)
    this.router.navigate([`/view-category/featured`])
  }

  async openIonModal(data) {
    console.log(data)

    const modal = await this.modalController.create({
      component: FilterDetailsPage,
      componentProps: {
        'model_title': data.genreDesc,
        'data': data,
        'type': 'genre'
      }
    });
    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        // this.modelData = modelData.data;
        console.log('Modal Data : ' + modelData.data);
      }
    });
    return await modal.present();
  }
}
