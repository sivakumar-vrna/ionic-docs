import { ChangeDetectorRef, Component, OnInit,} from '@angular/core';
import { Storage } from '@capacitor/storage';
import { GENRES_KEY,COUNTRIES_KEY } from '../vrna/services/ui-orchestration/orch.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/shared/services/user.service';
import {EventsService} from 'src/app/shared/services/events.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  countriesData: any; 
  genres: any;
  user_browser_country: any;

  public locales = [
    { title: 'English', code: 'en' },
    { title: 'தமிழ்', code: 'ta' },
    { title: 'తెలుగు', code: 'te'},
  ];

  public i18n_AuthPageLabels = {
    footer_terms_of_use: 'Terms of Service',
    footer_privacy_policy: 'Privacy Policy',
    by_signin_you_agree: 'By signing in, you agree to our',
    your_location: 'Your location',
    signin_with_google: 'Sign in with Google',
    signin_with_facebook: 'Sign in with Facebook'
  }
  public i18n_AuthPageLabels_temp: any;

  constructor(
    private chRef: ChangeDetectorRef,
    private userService: UserService,
    private eventsService: EventsService
  ) { 
    this.i18n_AuthPageLabels_temp = JSON.parse(JSON.stringify(this.i18n_AuthPageLabels));
    this.eventsService.subscribe('i18n:layout', (locale) => {      
      this.userService.translateLayout(this.i18n_AuthPageLabels, this.i18n_AuthPageLabels_temp, 
        locale);      
    });
  }

  async ngOnInit() {
    
  }

  keypressOnprivacy(event:KeyboardEvent):void{
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      event.preventDefault();      
    }
  }
  keypressOnterms(event:KeyboardEvent):void{
    if(event.key == 'ArrowLeft'){
      event.stopPropagation();
      event.preventDefault();      
    }
  }

  async ngAfterViewInit() {

    const countriesData = await Storage.get({ key: COUNTRIES_KEY });
    this.countriesData = countriesData ? JSON.parse(countriesData.value) : null;
    const tempData = await Storage.get({ key: GENRES_KEY });
    this.genres = JSON.parse(tempData.value);

    this.user_browser_country = (await Storage.get({ key: 'user_browser_country' })).value;

    //translate static labels // on page loads
    let user_locale = environment.user_locale;  
    this.userService.translateLayout(this.i18n_AuthPageLabels, this.i18n_AuthPageLabels_temp, 
      user_locale);

    this.chRef.detectChanges();

    setTimeout(() => {
      const firstElem = document.getElementById('id_email_input');
      if(firstElem){
        firstElem.focus();
      }
    }, 1100);
  }

  switchLocale(locale: any){
    Storage.set({ key: 'user_locale', value: locale.code });
    environment.user_locale = locale.code;
    this.userService.syncStaticTranslation(locale.code);
  }

  
}



