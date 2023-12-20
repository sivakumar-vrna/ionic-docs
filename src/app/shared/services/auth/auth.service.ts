import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { nanoid } from 'nanoid'
import { Auth } from '../../models/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@capacitor-community/http';
import { isPlatform } from '@ionic/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Storage } from '@capacitor/storage';
import { NavController } from '@ionic/angular';
import { RENTED_KEY } from '../intelligence.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { NavigationEnd, Router } from '@angular/router';
import { COUNTRY_KEY, CURRENCY_KEY, GENRES_KEY,COUNTRIES_KEY } from 'src/app/vrna/services/ui-orchestration/orch.service';
import { LocationService } from 'src/app/components/location/location.service';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Device } from '@capacitor/device';

export const TOKEN_KEY = 'token';
export const USER_KEY = 'userId';
export const USERNAME_KEY = 'username';
export const IMAGE_KEY = 'imageUrl';
export const STRIPE_KEY = 'rentId';
export const MAC_KEY = 'macId';

export const FIRSTLOGIN_KEY = 'firstLogin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  isFirstTimeLogin: boolean = false;
  countries: any[] = [];



  constructor(
    private http: HttpClient,
    public navCtrl: NavController,
    private toast: ToastWidget,
    private router: Router,
    private locationservice: LocationService,
    private modalController: ModalController,
    private toastController: ToastController,

  ) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  /* Registration Complete */
  async onUserConfirm(token: string) {
    const url = environment.authUrl + 'user/confirm?token=' + token;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.getCall(url, capacitorUrl);
  }

  /* Validating User */
  async onAuthentication(user: Auth, macAddress: any) {
    const url = environment.vrnaFlowUrl + 'login';
    const capacitorUrl = environment.capaciorUrl + url;
    return this.postRequest(url, capacitorUrl, user, macAddress);
  }

  onSignup(data: any, macAddress: any) {
    const url = environment.vrnaFlowUrl + 'signup';
    const capacitorUrl = environment.capaciorUrl + url;
    return this.postRequest(url, capacitorUrl, data, macAddress);
  }

  onRequestResetPwd(data: any, macAddress: any) {
    const url = environment.vrnaFlowUrl + 'forgotpassword';
    const capacitorUrl = environment.capaciorUrl + url;
    return this.postRequest(url, capacitorUrl, data, macAddress);
  }

  onResetPwd(data: any, macAddress: any) {
    const url = environment.authUrl + 'user/updpass';
    const capacitorUrl = environment.capaciorUrl + url;
    return this.postRequest(url, capacitorUrl, data, macAddress);
  }

  /* Unique ID Creation */
  async uniqueID() {

    const uuid = (await Device.getId()).uuid;
    return uuid;     
    
    /*
    const uniqueId = nanoid();
    return uniqueId;
    */
  }

  getHeaders(email) {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      userName: email,
    });
  }

  // GET - HTTP call for capacitor and Web
  async getCall(url: string, capacitorUrl: string) {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (isPlatform('capacitor')) {
      const options = {
        url: capacitorUrl,
        headers: headers,
      };
      return from(Http.get(options)).pipe(
        map((result) => result.data)
      );
    } else {
      return this.http
        .get<any>(url, {
          observe: 'response',
          headers: headers
        })
        .pipe(
          map((res) => res.body)
        );
    }
  }

  postRequest(url, capacitorUrl, postData: Auth, macAddress: any): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      userName: postData.email,
      macAddress: macAddress,
    };
    let token = null;
    if (isPlatform('capacitor')) {
      const options = {
        url: capacitorUrl,
        headers: headers,
        data: postData,
      };
      return from(Http.post(options)).pipe(
        tap(res => {
          token = res.headers['vrnaToken'];
        }),
        map(result => {
          result.data['token'] = token;
          return result.data;
        })
      );
    } else {
      return this.http.post<any>(url, postData, {
        observe: 'response',
        headers: headers
      }).pipe(
        tap(res => {
          token = res.headers.get('vrnaToken');
        }),
        map(res => {
          res.body['token'] = token;
          return res.body;
        })
      )
    }
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {

      // TODO: better job of transforming error for user consumption
      this.log(`${error.error.statusCode} : ${error.error.message}`);
      return of(result as T);
    }
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    // this.toast.onFail(message);
  }

   // #After Successfull login
  async afterLogin(userData: any, macId: any, token: string) {
    await Storage.set({ key: USER_KEY, value: JSON.stringify(userData.userId) });
    await Storage.set({ key: USERNAME_KEY, value: userData.email });
    await Storage.set({ key: IMAGE_KEY, value: userData.imageUrl });
    await Storage.set({ key: STRIPE_KEY, value: userData.stripeId });
    await Storage.set({ key: TOKEN_KEY, value: token });
    await Storage.set({ key: MAC_KEY, value: macId });
  
    localStorage.setItem('USER_KEY', JSON.stringify(userData.userId));
    localStorage.setItem('USERNAME_KEY', userData.email);
    localStorage.setItem('IMAGE_KEY', userData.imageUrl);
    localStorage.setItem('STRIPE_KEY', userData.stripeId);
    localStorage.setItem('TOKEN_KEY', token);
    localStorage.setItem(MAC_KEY, macId);
  
    this.isAuthenticated.next(true);
  
    if (userData.country) {
      await Storage.set({ key: COUNTRY_KEY, value: userData.country });
      localStorage.setItem(COUNTRY_KEY, userData.country);
      
      let userCurrency = await this.getCurrencyForCountryCode(userData.country); 
      await Storage.set({ key: CURRENCY_KEY, value: userCurrency }); 
  
      console.log(userData.country);
      console.log(userCurrency);
      
      this.isFirstTimeLogin = false; 
      await Storage.set({ key: FIRSTLOGIN_KEY, value: 'false' });
      localStorage.setItem(FIRSTLOGIN_KEY, 'false');


    } else {
      this.isFirstTimeLogin = true; 
      await Storage.set({ key: COUNTRY_KEY, value: null });
      localStorage.setItem(COUNTRY_KEY, null);
      await Storage.set({ key: FIRSTLOGIN_KEY, value: 'true' });
      localStorage.setItem(FIRSTLOGIN_KEY, 'true');
      (window as any).location.reload();
      // await Storage.remove({ key: COUNTRY_KEY });
      // localStorage.removeItem(COUNTRY_KEY);
      
    }
  
    this.isAuthenticated.next(true);
    //this.router.navigate(['/home'], { replaceUrl: true });
    this.router.navigate(['/switch-profiles'], { replaceUrl: true })
    .then(() => {
      (window as any).location.reload();
    });


    /*
    if (!userData.country) {
      this.router.events.subscribe(async (event) => {
        if (event instanceof NavigationEnd) {
          if (this.isFirstTimeLogin) {
            this.isFirstTimeLogin = false; 
            await Storage.set({ key: FIRSTLOGIN_KEY, value: 'false' });
            localStorage.setItem(FIRSTLOGIN_KEY, 'false');
          } else {
            // this.openLocationPopover();
            window.location.reload();
          }
        }
      });
    }
    */

  }
  
  async getCurrencyForCountryCode(countryCode: string) {
    let country:any;
    try{
      this.countries = JSON.parse((await Storage.get({ key: COUNTRIES_KEY }))?.value);
      if(this.countries == null){
        this.countries = JSON.parse(environment.json_countries);
      }
      country = this.countries.find((data) => data.countryCode === countryCode);
    }
    catch(err){}
    if (country) {
      return country.currency;
    } else {
      return "Unknown Currency";
    }
    }
  

  async openLocationPopover() {
   const locationService = new LocationService(this.modalController);
    await locationService.getLocationPopover();
  }
  
  logout() {
    this.isAuthenticated.next(false);
    Storage.remove({ key: USER_KEY });
    Storage.remove({ key: USERNAME_KEY });
    Storage.remove({ key: IMAGE_KEY });
    Storage.remove({ key: MAC_KEY });
    Storage.remove({ key: RENTED_KEY });
    Storage.remove({ key: STRIPE_KEY });
    //Storage.remove({ key: GENRES_KEY });
    Storage.remove({ key: TOKEN_KEY });
    Storage.remove({ key: CURRENCY_KEY});
    Storage.remove({key: COUNTRY_KEY});

    localStorage.clear();
    Storage.clear();

    this.router.navigate(['/auth/login']);
    (window as any).location.reload();

    return true;
  }

}
