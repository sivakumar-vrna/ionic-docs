import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatform } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { INTRO_KEY } from 'src/app/guards/intro.guard';
import { BackgroundColorOptions, StatusBar, Style } from '@capacitor/status-bar';

// #importing Swiper core and required modules
import SwiperCore, { SwiperOptions, Navigation, Pagination, A11y } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

// #installing Swiper modules
SwiperCore.use([Navigation, Pagination, A11y]);

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IntroPage implements OnInit {
  isDevice: boolean;
  public opts: BackgroundColorOptions = {
    color: '#efe379'
  }
  public introOptions: SwiperOptions = {
    pagination: true,
    centeredSlides: true,
    parallax: true,
  }

  @ViewChild('introSlide', { static: false }) swiper?: SwiperComponent;

  constructor(
    private router: Router
  ) {
    this.isDevice = isPlatform('capacitor');
    const currentUrl = this.router.url.split('/')[1];
    if (currentUrl === 'intro' && isPlatform('capacitor')) {
      StatusBar.setBackgroundColor(this.opts);
      StatusBar.setStyle({ style: Style.Light });
    }
  }

  ngOnInit() { }

  next() {
    this.swiper.swiperRef.slideNext(100);
  }

  async start(url) {
    await Storage.set({ key: INTRO_KEY, value: 'true' });
    this.router.navigate([url]);
  }
}
