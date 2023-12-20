import { AfterViewInit, Component, OnInit, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Storage } from '@capacitor/storage';
import { themeService, THEME_KEY } from './shared/services/theme/theme.service';
import { Platform, isPlatform, LoadingController, IonContent } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Geolocation } from '@capacitor/geolocation';
import { CommonService } from './shared/services/common.service';
import { COUNTRY_KEY } from './vrna/services/ui-orchestration/orch.service';
import { DisableRightClickService } from './shared/services/disable-right-click.service';
import {setNavigableClassName} from "arrow-key-nav";
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { USER_KEY} from 'src/app/shared/services/auth/auth.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
//import { getCountry } from  'easy-reverse-geocoding';
import {SeoService} from 'src/app/shared/services/seo.service';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/shared/services/http.service';
import {EventsService} from 'src/app/shared/services/events.service';
import { UserService } from './shared/services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {

  @ViewChild(IonContent) content: IonContent;

  isAppLoading: any;
  previousUrl: any;
  currentUrl: any;

  constructor(
    private theme: themeService,
    private platform: Platform,
    private commonService: CommonService,
    private rightClickDisable: DisableRightClickService,
    private loadingController: LoadingController,
    private router: Router,
    private nativeGeocoder: NativeGeocoder,
    private profileService: ProfileService,
    private chRef: ChangeDetectorRef,
    private seoService: SeoService,
    private activatedRoute: ActivatedRoute,
    private httpService: HttpService,
    public eventsService: EventsService,
    private userService: UserService,

  ) {

    this.httpService.setupCloudflareCountry(environment.baseUrl);    
    this.onLoadTheme();
  } 

  async onLoadTheme() {    
    const theme: any = await Storage.get({ key: THEME_KEY });
    this.theme.onTheme(theme.value);
  }
  
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEventkeydown(event: KeyboardEvent) {
    if(event.key == 'Enter'){
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.click();
        if(document.activeElement.tagName != 'INPUT'){
          event.preventDefault();
        }
      }         
    }    
  }  

  async ngOnInit() {    

    this.isAppLoading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 1000
    });
    await this.isAppLoading.present();

    this.rightClickDisable.disableRightClick(); // disable right click for the entire application
    setNavigableClassName("arrow-navigable");    
    
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.url;      
      this.chRef.detectChanges();
    });    

    console.time('Perf: AppComponent Screen');
    
    this.platform.backButton.subscribeWithPriority(5, () => {

      const currentUrlPart = this.currentUrl.split('/')[1];    

      if(
        this.currentUrl == '/auth/login' || 
        this.currentUrl == '/home' || 
        currentUrlPart === 'intro'
      ){
        if ((window as any).confirm("Do you want to exit app?")) {        
          App.exitApp();
        }
      }else if(this.currentUrl == '/auth/signup'){
        this.router.navigate(['/auth/login']);
      }else if(this.currentUrl == '/switch-profiles'){
        this.router.navigate(['/home']);
      }else{
        // this.router.navigate(['/home']);
        this.router.navigate(['/switch-profiles']);
      }

      /*
      if (window.confirm("Do you want to exit app?")) {        
        App.exitApp();        
      } else{
        this.router.navigate(['/home']);
      }
      */

    });    

    
    /*
    //commented as navigtaion via history is not good for the app's realtime updates//
    App.addListener('backButton', ({ canGoBack }) => {
           
        if(canGoBack){
          if(this.currentUrl == '/auth/login' || this.currentUrl == '/home'){
            if (window.confirm("Do you want to exit app?")) {        
              App.exitApp();
            }
          }else if(this.currentUrl == '/auth/signup'){
            this.router.navigate(['/auth/login']);
          }else{
            this.router.navigate(['/home']);
          }          
        } else {
          if (window.confirm("Do you want to exit app?")) {        
            App.exitApp();
          }else{
            this.router.navigate(['/home']);
          }
        }

    });
    */  

  }  

  async getLocation() {

    const coordinates = await Geolocation.getCurrentPosition({
       enableHighAccuracy: true, timeout: 30000, maximumAge: Infinity
    });

    //const coordinates = await Geolocation.getCurrentPosition();

    /*
    Geolocation.getCurrentPosition({timeout: 30000, enableHighAccuracy: true})
    .then(position => {
      this.position = position;
    }, error => console.log(error));
    */

    //get user location from Cloudflare
    //TBD
    
    /*
    let lines = CFcountryCodeResp.split("\n");
      let keyValue;
      lines.forEach(function (line) {
        keyValue = line.split("=");
        trace[keyValue[0]] = decodeURIComponent(keyValue[1] || "");

        if (keyValue[0] === "loc" && trace["loc"] !== "XX") {
        
          Storage.set({ key: 'user_browser_country', value: trace["loc"] });
                    
        }
      });
      */

    //location capture should happen before the user logged in as well.
    //location capture at after login is covered on /layout/topbar.ts

    const user: string = (await Storage.get({ key: USER_KEY })).value;
    if(user == null || user == '')
    {
        const latitude = coordinates.coords.latitude;
        const longitude = coordinates.coords.longitude;

        if (!isPlatform('capacitor')) {

          const apiUrl = 'https://nominatim.openstreetmap.org/reverse';
          const requestData = {
            lat: ''+latitude,
            lon: ''+longitude,
            format: 'json',
          };
          
          fetch(`${apiUrl}?${new URLSearchParams(requestData)}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((result) => {
              const countryCode = result.address.country_code.toUpperCase();              
              if(countryCode != null){
                Storage.set({ key: 'user_browser_country', value: countryCode });
              }      
            })
            .catch((error) => {
              console.error('Error:', error);
            });

      } else {  
          
          let options: NativeGeocoderOptions = {
            useLocale: true,
            maxResults: 1
          };
          this.nativeGeocoder.reverseGeocode(latitude, longitude, options)
          .then((result: NativeGeocoderResult[]) => {
            let countryCode = result[0].countryCode.toUpperCase();
            if(countryCode != null && countryCode != ''){            
              Storage.set({ key: 'user_browser_country', value: countryCode });                        
            }
          })
          .catch((error: any) => console.log(error));
      }
    }
  }  

  async ngAfterViewInit() {
    console.log('after init');
    SplashScreen.show({
      showDuration: 2000,
      autoHide: true
    });

    let cloudflare_geo: string;
    (await this.httpService.getGeoFromCloudflare()).subscribe(
      (res: any) => {
        environment.geo_from_cloudflare = res;             
      }
    ); 


    this.getLocation();

    //start translation if user locale is other than (en)
    let user_locale: string = environment.default_locale;
    let json_user_locale = await Storage.get({ key: 'user_locale'});
    if(json_user_locale.value != null && json_user_locale.value != ''){
      user_locale = json_user_locale.value;
      environment.user_locale = user_locale;
    }

    //if(user_locale != 'en'){
      setTimeout(() => {      
        this.userService.syncStaticTranslation(user_locale);
      }, 2000);
    //}
    

    console.timeEnd('Perf: AppComponent Screen');    
  }  

}