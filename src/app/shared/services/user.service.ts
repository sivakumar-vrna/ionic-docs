import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { COUNTRY_KEY } from 'src/app/vrna/services/ui-orchestration/orch.service';
import {
  MAC_KEY,
  STRIPE_KEY,
  TOKEN_KEY,
  USERNAME_KEY,
  IMAGE_KEY,
  USER_KEY,
  AuthService,
} from './auth/auth.service';
import { RENTED_KEY } from './intelligence.service';
import { EXPIRY, REMEMBER } from 'src/app/auth/login/login.page';
import { environment } from 'src/environments/environment';
import {EventsService} from 'src/app/shared/services/events.service';


@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    private authservice: AuthService,
    private eventsService: EventsService
  ) { }

  async getRentedMoviesList() {
    const tempData = await Storage.get({ key: RENTED_KEY });
    const rentedList = JSON.parse(tempData.value);
    return rentedList;
  }

  async getCurrentToken() {
    const userToken = await Storage.get({ key: TOKEN_KEY });
    return userToken.value;
  }

  async getUniqueId() {
    const uId = await Storage.get({ key: MAC_KEY });
    return uId.value;
  }

  async getUserId(): Promise<number> {
    const id = await Storage.get({ key: USER_KEY });
    return parseInt(id.value);
  }

  async getEmail(): Promise<string> {
    const email = await Storage.get({ key: USERNAME_KEY });
    return email.value;
  }  

  async getImage(): Promise<string> {
    const imageUrl = await Storage.get({ key: IMAGE_KEY });
    return imageUrl.value;
  }  

  async getStripeId() {
    const stripe = await Storage.get({ key: STRIPE_KEY });
    return stripe.value;
  }

  async getCountryCode() {
    const country = await Storage.get({ key: COUNTRY_KEY });
    return country.value;
  }

  async onAuth(): Promise<boolean> {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      this.checkExpiration();
      return true;
    } else {
      return false;
    }
  }
  
  async checkExpiration() {
    // const rememberMe = localStorage.getItem('rememberMe');
    // const expireAt = localStorage.getItem('expire_at');

    const rememberMe = Storage.get({ key: REMEMBER });
    // const expireAt = await Storage.get({ key: 'expireAt' });
    const expireAt = Storage.get({ key: EXPIRY });
    
    if (rememberMe.toString() == 'false') {
      const currentTimestamp = new Date();
      const ctime = currentTimestamp.toString();
      // console.log('compare', ctime > expireAt)
      if (ctime >= expireAt.toString()) {
        this.authservice.logout();
        localStorage.clear();
        Storage.clear();
      }
    }
  }

  async getTranslation(locale: string = 'en'){
    const res = await Storage.get({ key: 'i18n_layout_' + locale });
    return res.value;
  }

  async syncStaticTranslation(locale:string = 'en'){

    environment.user_locale = locale;

    //check the data from Storage-local
    let json_data = await Storage.get({ key: 'i18n_layout_' + locale });
    if(json_data.value != null && json_data.value != ''){
      this.eventsService.publish('i18n:layout', locale);
    } else {
       fetch(environment.cms_api_base_url+'/api/layout?locale='+locale)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((result) => {
        const json_result = JSON.stringify(result.data.attributes);        
        if(json_result != null){
          Storage.set({ key: 'i18n_layout_' + locale, value: json_result });          
          this.eventsService.publish('i18n:layout', locale);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  }

  async syncDynamicTranslation(item_ype:string, filterby_field:string, filterby_val:string){

    let user_locale: string = environment.default_locale;
    let json_user_locale = await Storage.get({ key: 'user_locale'});
    if(json_user_locale.value != null && json_user_locale.value != ''){
      user_locale = json_user_locale.value;
    }

    const str_filter = 'filters['+filterby_field+'][$eq]='+filterby_val;
    const evt_channel_name = 'i18n:dynamic_' + item_ype + '_' + filterby_val;
   
    fetch(environment.cms_api_base_url + '/api/' +
      item_ype + 's?' + str_filter + '&locale=' + user_locale)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((result) => {        
      if(Object.keys(result.data).length){
        this.eventsService.publish(evt_channel_name, result.data);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    
  }

  async translateLayout(srcTranslateData, srcTranslateData_temp, locale){
    
    if(locale == '' || locale == null){
      locale = 'en';
    }

    this.getTranslation(locale).then(data_i18n => {
      let json_data_i18n = JSON.parse(data_i18n);        
      const keys = Object.keys(srcTranslateData); 
      keys.forEach((key) => {
        if(json_data_i18n[key]){
          srcTranslateData[key] = json_data_i18n[key];
        }else{
          srcTranslateData[key] = srcTranslateData_temp[key];
        }                      
      });
    });
  }

  async translateGenre(locale, genres, genres_temp){    

    this.getTranslation(locale).then(data_i18n => {
      let json_data_i18n = JSON.parse(data_i18n);
      genres.map((genr, index) => {
        let str_menu_title: string = genres_temp[index].genreDesc.toLowerCase();
        str_menu_title = str_menu_title.split(' ').join('_');
        str_menu_title = str_menu_title.split('-').join('_');
        if(json_data_i18n['genre_'+str_menu_title]){
          genr.genreDesc = json_data_i18n['genre_'+str_menu_title];
        }else{
          genr.genreDesc = genres_temp[index].genreDesc;
        }
      });
    });    
  }


}