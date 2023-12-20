import { Component, Input, OnInit } from '@angular/core';
import { isPlatform, ModalController } from '@ionic/angular';
import { CastService } from 'src/app/shared/services/cast/cast.service';
import { environment } from 'src/environments/environment';
import { SwiperOptions } from 'swiper';
import { ActorPageMobileComponent } from '../actor-page/actor-page-mobile/actor-page.component';
import {EventsService} from 'src/app/shared/services/events.service';
import { UserService } from 'src/app/shared/services/user.service';


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
    public eventsService: EventsService,
    private userService: UserService,

  ) { 
    
  }

  async ngOnInit() {

    //translating the movie*
    const evt_channel_name = 'i18n:dynamic_cast_' + this.cast.castId;
    this.eventsService.subscribe(evt_channel_name, (movie_data) => {
      if(movie_data?.[0].attributes != null){
        Object.keys(movie_data?.[0].attributes).forEach(function(key) {
          if(movie_data?.[0].attributes[key] != null && 
            movie_data?.[0].attributes[key] != ''){
            if (typeof movie_data?.[0].attributes[key] === 'object' && movie_data?.[0].attributes[key]['data'] != null) {
              this.cast[key] = movie_data?.[0].attributes[key]['data'];
            } else{
              this.cast[key] = movie_data?.[0].attributes[key];
            }
          }
        }.bind(this));
      }
    });

    //trnslate the movie content
    this.userService.syncDynamicTranslation('cast', 'castId', ''+this.cast.castId);
    

    console.time('Perf: CastDetails Screen');

    if (isPlatform('capacitor')) {
      this.domainUrl = environment.capaciorUrl;
    } else {
      this.domainUrl = (window as any).location.origin;
    }
    (await this.castMovies.onCastMovies(this.cast.castId)).subscribe(res => {
      if (res.status.toLowerCase() === 'success' && res.statusCode === '200') {
        const tempData: any = res.data;
        tempData['tempData'] = this.domainUrl + '/images' + tempData.tempData;
        this.castMoviesData = tempData;
        this.castMoviesData.map(cast => cast['posterurl'] = this.domainUrl + '/images' + cast.posterurl)
      }
    })
  }
  keypressOnCast(event:KeyboardEvent):void{
    let elem:any;
    if(event.key == 'ArrowRight'){
     elem = document.getElementById('idCastImg');
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
    if(event.key == 'ArrowDown'){
      elem = document.getElementById('idCastImg');
     }
     if(elem){
       event.stopPropagation();
       elem.focus();
       event.preventDefault();
     }

  }
  keypressOnCastImg(event: KeyboardEvent): void {
    let elem:any;
    if(event.key == 'ArrowUp'){
     elem = document.getElementById('backbtn_cast');
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
    if(event.key == 'ArrowDown'){
      elem = document.getElementById('Cast_Dec');
     }
     if(elem){
       event.stopPropagation();
       elem.focus();
       event.preventDefault();
     }
     if(event.key == 'ArrowRight'){
      event.stopPropagation();
       event.preventDefault();
     }
     if(event.key == 'ArrowLeft'){
       event.stopPropagation();
       event.preventDefault();
     }
  }

  keypressOnCastDesc(event: KeyboardEvent): void {
    let elem: any;    
    if(event.key == 'ArrowDown'){
      elem = document.getElementById('related_cast_movies-0');                  
    }
    if(event.key == 'ArrowUp'){
      elem = document.getElementById('idCastImg');
    }
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
       event.preventDefault();
     }
     if(event.key == 'ArrowLeft'){
       event.stopPropagation();
       event.preventDefault();
     }

    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }

  keypressOnRelated_cast(event:KeyboardEvent):void{
    let elem:any;
    if(event.key == 'ArrowUp'){
      elem = document.getElementById('Cast_Dec');
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
    if(event.key == 'ArrowDown'){
      event.stopPropagation();
      event.preventDefault();
    }
  }

  ngAfterViewInit() {
    console.timeEnd('Perf: CastDetails Screen');

    setTimeout(() => {
      let elem:any;
        elem= document.getElementById('backbtn_cast');
        if(elem){
          elem.focus();
        }
      
    }, 1000);
  }



  async onActorPage(cast) {
    const modal = await this.modalController.create({
      component: ActorPageMobileComponent,
      cssClass: 'cast-popup-modal',      
      componentProps: {
        'cast': cast,
      }
    });
    await modal.present();

    const { role } = await modal.onDidDismiss();

  }
  
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
    this.eventsService.unsubscribe('i18n:dynamic_cast_' + this.cast.castId);

  }
}
