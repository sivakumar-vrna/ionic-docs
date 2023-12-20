import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatform, ModalController } from '@ionic/angular';
import { SearchPage } from 'src/app/vrna/pages/search/search.page';
import { themeService, THEME_KEY } from 'src/app/shared/services/theme/theme.service';
import { Storage } from '@capacitor/storage';
import { LocationService } from 'src/app/components/location/location.service';
import { COUNTRIES_KEY, COUNTRY_KEY } from 'src/app/vrna/services/ui-orchestration/orch.service';

import { Geolocation } from '@capacitor/geolocation';
import { USER_KEY} from 'src/app/shared/services/auth/auth.service';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { environment } from 'src/environments/environment';
import { NOTIFICATION_KEY } from 'src/app/vrna/pages/notifications/notifications.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  notifications: any[];
  notification_length: number = 0;
  public isMobile: boolean = false;
  currentTheme: boolean;
  currency: string = localStorage.getItem('currency');
  isLocationPopoverOpen: boolean = false;
  isManualLocPopTrigger: boolean = false;
  

  menus = [
    { title: 'Featured', url: '/view-category/featured', icon: 'heart' },
    { title: 'Rented', url: '/view-category/rented', icon: 'albums' },
    { title: 'Latest', url: '/view-category/latest', icon: 'person' }
  ];

  constructor(
    private router: Router,
    public modalController: ModalController,
    private theme: themeService,
    private locationService: LocationService,
    private chRef: ChangeDetectorRef,
    private nativeGeocoder: NativeGeocoder,
    private profileService: ProfileService,
  ) {
    if (isPlatform('capacitor')) {
      this.isMobile = true;
    }
    this.getCurrentTheme();
  }
  keypressOnLoaction(event:KeyboardEvent):void{
    let elem:any;
    if(event.key =='ArrowUp'){
      event.stopPropagation();
      event.preventDefault();
    }
    if(event.key =='ArrowLeft'){
      event.stopPropagation();
      event.preventDefault();
    }
    if(event.key == 'ArrowDown'){
      elem = document.getElementById('bannerMain');
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }
   keypressOnToggle(event:KeyboardEvent):void{
    let elem:any;
    if(event.key =='ArrowUp'){
      event.stopPropagation();
      event.preventDefault();
    }
    if(event.key == 'ArrowDown'){
      elem = document.getElementById('bannerMain');
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }
  keypressOnSearchIcon(event:KeyboardEvent):void{
    let elem:any;
    if(event.key =='ArrowUp'){
      event.stopPropagation();
      event.preventDefault();
    }
    if(event.key == 'ArrowDown'){
      elem = document.getElementById('bannerMain');
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }
  keypressOnNotification(event:KeyboardEvent):void{
    let elem:any;
    if(event.key =='ArrowUp'){
      event.stopPropagation();
      event.preventDefault();
    }
    if(event.key == 'ArrowDown'){
      elem = document.getElementById('bannerMain');
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }

  keypressOnMenu(event:KeyboardEvent):void{
    let elem:any;
    if(event.key =='ArrowRight'){
      event.stopPropagation();
      event.preventDefault();
    }
    if(event.key == 'ArrowDown'){
       elem = document.getElementById('bannerMain');
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
    
  }

  async ngOnInit() {
    try{
      this.notifications = JSON.parse((await Storage.get({ key: NOTIFICATION_KEY }))?.value);
      this.notification_length = this.notifications.length;
    }catch(err){
      console.log(err);
    }
  }

  async ngAfterViewInit() {

    const user: string = (await Storage.get({ key: USER_KEY })).value;
    const country: string = (await Storage.get({ key: COUNTRY_KEY })).value;
    if (user != null && user != '' && 
      (country === null || country === undefined || country == '' 
      || country == 'null')) {

      //if user_browser_country is already detected on login screen; 
      //let us use it.
      
      const user_browser_country: string = (await Storage.get({ key: 'user_browser_country' })).value;
      if(user_browser_country != null && user_browser_country != '')
      {
        let userId = parseInt(user);
        const data = {
          userId: userId,
          country: user_browser_country, 
        };
        this.updateProfileCountry(data);
      } else {
        this.syncUserLocation(user);
      }
    }      

    setTimeout(() => {
      this.getCurrentLocation();
    }, 1000);

  }

  async syncUserLocation (user){

      //const coordinates = await Geolocation.getCurrentPosition();
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true, timeout: 30000, maximumAge: Infinity
      });
      
      const latitude = coordinates.coords.latitude;
      const longitude = coordinates.coords.longitude;

      //for web
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
              let userId = parseInt(user);            
              const data = {
                userId: userId,
                country: countryCode, 
              };
              this.updateProfileCountry(data);
            })
            .catch((error) => {
              console.error('Error:', error);
            });

      } else {
      
          //Also make sure to have the CountryCode on our master data should 
          //follow ISO; for ex: India=>IN 

          let options: NativeGeocoderOptions = {
            useLocale: true,
            maxResults: 1
          };
          this.nativeGeocoder.reverseGeocode(latitude, longitude, options)
          .then((result: NativeGeocoderResult[]) => {
              let countryCode = result[0].countryCode.toUpperCase();
              if(countryCode != null && countryCode != ''){            
                let userId = parseInt(user);            
                const data = {
                  userId: userId,
                  country: countryCode, 
                };
                this.updateProfileCountry(data);            
              }
          })
          .catch((error: any) => console.log(error));         

      }

  }


  async updateProfileCountry(data){
    Storage.set({ key: COUNTRY_KEY, value: data.country });

    console.log('country at update:', data.country);
    
    (await this.profileService.updateProfile(data)).subscribe(
      (res: any) => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {

          //this.router.navigate(['/home']);
          (window as any).location.reload();          
        }
      }      
    );
  }

  async getCurrentTheme() {
    const theme: any = await Storage.get({ key: THEME_KEY });
    if (theme.value === 'dark') {
      this.currentTheme = true;
    } else {
      this.currentTheme = false;
    }
  }

  onNavigate(path: string) {
    this.router.navigate([path]);
  }

  async getCurrentLocation() {

    //create a subscriber to the localstoarge to update currency chanages
    //TBD

    let countries = JSON.parse((await Storage.get({ key: COUNTRIES_KEY }))?.value);
    const location = (await Storage.get({ key: COUNTRY_KEY }))?.value;   
    
    if(countries == null){
      countries = JSON.parse(environment.json_countries);
    }

    this.currency = countries.find((x: any) => x.countryCode === location)?.currency;
    this.chRef.detectChanges();
  }

  getLocation() {
   if (!this.isLocationPopoverOpen) {
      this.isLocationPopoverOpen = true;
      this.isManualLocPopTrigger = true;
      this.locationService.getLocationPopover(this.isManualLocPopTrigger).then(async () => {
        this.isLocationPopoverOpen = false;
        this.getCurrentLocation();
      });
    }
  }
  async searchModal() {
    const modal = await this.modalController.create({
      component: SearchPage,
      cssClass: 'movie-details-modal'
    });
    await modal.present();

    const { } = await modal.onDidDismiss();
    this.router.navigate(['/home']);
  }

  onThemeChange(e: any) {
    if (e.detail.checked) {
      this.theme.onTheme('dark');
    } else {
      this.theme.onTheme('light');
    }
  }
}
