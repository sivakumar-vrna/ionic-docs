import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatform } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { INTRO_KEY } from 'src/app/guards/intro.guard';
import { BackgroundColorOptions, StatusBar, Style } from '@capacitor/status-bar';
import { UAParser } from 'ua-parser-js';
import { EventsService } from 'src/app/shared/services/events.service';
import { UserService } from 'src/app/shared/services/user.service';

// #importing Swiper core and required modules
import SwiperCore, { SwiperOptions, Navigation, Pagination, A11y } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { environment } from 'src/environments/environment';

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
  showSignupOptOnIntroScreen: boolean = false;

  public opts: BackgroundColorOptions = {
    color: '#efe379'
  }
  public introOptions: SwiperOptions = {
    pagination: true,
    centeredSlides: true,
    parallax: true,
  }

  @ViewChild('introSlide', { static: false }) swiper?: SwiperComponent;

  public i18n_IntroPageLabels = {
    introslide_1_title: 'Welcome to VRNA',
    introslide_1_descr: 'VRNA is your go to video streaming app for the best of video contents',
    introslide_2_title: 'Theater Quality',
    introslide_2_descr : 'VRNA is an platform build to give you high quality in theater experience.',
    introslide_3_title : 'Get Started',
    introslide_3_descr : 'VRNA all available, ad-free, with a world class customer experience.',
    login : 'Login',
    signup : 'Signup',
    footer_terms_of_use : 'Terms of Use',
    footer_privacy_policy : 'Privacy Policy',
    by_signin_you_agree: 'By signing in, you agree to our',

  }
  public i18n_IntroPageLabels_temp: any;

  

  constructor(
    private router: Router,
    private eventsService: EventsService,
    private userService: UserService,
  ) {
    this.isDevice = isPlatform('capacitor');
    const currentUrl = this.router.url.split('/')[1];
    if (currentUrl === 'intro' && isPlatform('capacitor')) {
      StatusBar.setBackgroundColor(this.opts);
      StatusBar.setStyle({ style: Style.Light });
    }
    this.i18n_IntroPageLabels_temp = JSON.parse(JSON.stringify(this.i18n_IntroPageLabels));

    //first time on page refresh // translate
    this.eventsService.subscribe('i18n:layout', (locale) => {      
      this.userService.translateLayout(this.i18n_IntroPageLabels, this.i18n_IntroPageLabels_temp, 
       locale);      
    });
  }  

  keypressOnFirstSlide(event: KeyboardEvent): void {    
    if( event.key == 'ArrowRight' || event.key == 'ArrowDown'){
      event.stopPropagation();
      this.next();
      let elem = document.getElementById('btnSecondScreen');
      if(elem){
        elem.focus();
      }
      event.preventDefault();
    }
  }

  keypressOnSecondSlide(event: KeyboardEvent): void {    
    if( event.key == 'ArrowRight' || event.key == 'ArrowDown'){
      event.stopPropagation();
      this.next();
      let elem = document.getElementById('btnThirdScreenLogin');
      if(elem){
        elem.focus();
      }      
      event.preventDefault();
    }
    if( event.key == 'ArrowLeft'){
      event.stopPropagation();
      this.prev();
      let elem = document.getElementById('btnFirstScreen');
      if(elem){
        elem.focus();
      }      
      event.preventDefault();
    }
  }


  keypressOnSwiper(event: KeyboardEvent): void {  
    let elem:any;
    if( event.key == 'ArrowLeft' ){
      this.prev();
    }
    if(event.key == 'ArrowUp'){
      elem = document.getElementById('id_email_input');
      if(!elem){
        elem = document.getElementById('id_token_input');
      }
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
   }

   keypressonLastslide(event:KeyboardEvent):void{
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      event.preventDefault();      
    }
   }
  

  ngOnInit() {    
    console.time('Perf: IntroPage Screen');    

     
  } 
  
  async ngAfterViewInit() {
    console.timeEnd('Perf: IntroPage Screen');

    this.isDevice = isPlatform('capacitor');
    const hasSeenIntro = await Storage.get({ key: INTRO_KEY });
    //let hasSeenIntro:any = {};


    if (isPlatform('capacitor')) {

      if (hasSeenIntro && (hasSeenIntro.value === 'true')) { ;        
      } else {

        this.showSignupOptOnIntroScreen = true;

        setTimeout(() => {
          let elem = document.getElementById('btnFirstScreen');
          if(elem){
            elem.focus();
          }
        }, 500);
        
      }
    }

    //translate static labels // on page loads
    let user_locale = environment.user_locale;  
    this.userService.translateLayout(this.i18n_IntroPageLabels, this.i18n_IntroPageLabels_temp, 
      user_locale);    
    
  }

  next() {
    this.swiper.swiperRef.slideNext(100);
  }

  prev(){
    this.swiper.swiperRef.slidePrev(100);
  }

  async start(url) {
    await Storage.set({ key: INTRO_KEY, value: 'true' });
    this.router.navigate([url]);
  }

  
}
