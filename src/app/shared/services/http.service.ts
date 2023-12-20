import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@capacitor-community/http';
import { isPlatform } from '@ionic/angular';
import { from, throwError, Subject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UserService } from './user.service';
import { Storage } from '@capacitor/storage';
import { TOKEN_KEY } from './auth/auth.service';
import { LocationService } from 'src/app/components/location/location.service';
import { ErrorService } from './error.service';


//adding firebase logging sdk
import { Logger } from '@firebase/logger';
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
//import { getPerformance } from "firebase/performance";
import { environment } from 'src/environments/environment';

const firebase_config = environment.firebase;

// Initialize Firebase
const app = initializeApp(firebase_config);
const logClient = new Logger(`@firebase/logger`);

//TBD -- ENABLE THIS FOR THE WEB and MOBILE//
//const perf = getPerformance(app);
//commented since SSR is not supporting this; throwing error.
//const analytics = getAnalytics(app);
//analytics.app.automaticDataCollectionEnabled = true;
//perf.dataCollectionEnabled = true;
//perf.instrumentationEnabled = true;

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private locationService: LocationService,
    private errorService: ErrorService
  ) { }

  async setupCloudflareCountry(baseUrl: string) {

    this.http.get(baseUrl + '/cdn-cgi/trace', { responseType: 'text' })
      .subscribe(
        function(response) { 
          let str_resp: string = response as string;
          let lines = str_resp.split("\n");
          let keyValue;
          let trace = [];
          lines.forEach(function (line) {
            keyValue = line.split("=");
            trace[keyValue[0]] = decodeURIComponent(keyValue[1] || "");
            if (keyValue[0] === "loc" && trace["loc"] !== "XX") {  
              console.log('user_browser_country: '+trace["loc"]);          
              Storage.set({ key: 'user_browser_country', value: trace["loc"] });                        
            }
          });
        },
        function(error) { 
          console.log("Error:" + JSON.stringify(error));
        }
      );
  }

  async getGeoFromCloudflare() {   
    
    
    return this.http.get(environment.baseUrl + '/cdn-cgi/trace', { responseType: 'text' });
    
    

    /*

    this.http.get(baseUrl + '/cdn-cgi/trace', { responseType: 'text' })
      .subscribe(
        function(response) { 
          let str_resp: string = response as string;
          let lines = str_resp.split("\n");
          let keyValue;
          let trace = [];
          lines.forEach(function (line) {
            keyValue = line.split("=");
            trace[keyValue[0]] = decodeURIComponent(keyValue[1] || "");
            if (keyValue[0] === "loc" && trace["loc"] !== "XX") {  
              console.log('user_browser_country: '+trace["loc"]);          
              Storage.set({ key: 'user_browser_country', value: trace["loc"] });                        
            }
          });
        },
        function(error) { 
          console.log("Error:" + JSON.stringify(error));
        }
      );

      */
  }

  // GET - HTTP call for capacitor and Web
  async getCall(url: string, capacitorUrl: string) {    
    
    if (isPlatform('capacitor')) {
      const options = {
        url: capacitorUrl,
        headers: await this.header(),
      };
      
      //API performance logging
      console.time("Perf: GET "+capacitorUrl);
      
      logClient.log('getCall API | Request Start | Capacitor | '+capacitorUrl);
      return from(Http.get(options)).pipe(
        tap((res) => {

          //API performance logging
          console.timeEnd("Perf: GET "+capacitorUrl);

          logClient.log('getCall API | Request End | Capacitor | '+capacitorUrl);
          const token = res?.headers['vrnaToken'];
          if (token !== undefined && token !== null) {
            this.setToken(token);
          }
        }),
        map((result) => result.data)
      );
    } else {
      //API performance logging
      console.time("Perf: GET "+url);
      logClient.log('getCall API | Request Start | Web | '+url);
      return this.http
        .get<any>(url, {
          observe: 'response',
          headers: await this.header()
        })
        .pipe(
          catchError((err: any) => {
            console.error(err);
            this.errorService.onErrorMsg(err?.error?.statusCode)
            return throwError(err);    //Rethrow it back to component
          }),
          tap((res: any) => {
            console.timeEnd("Perf: GET "+url);
            logClient.log('getCall API | Request End | Web | '+url);
            const token = res.headers['vrnaToken'];
            if (token !== undefined && token !== null) {
              this.setToken(token);
            }
          }),
          map((res: any) => res.body)
        );
    }
  }

  // POST - HTTP call for capacitor and Web
  async postCall(url: string, capacitorUrl: string, postData: any) {
    if (isPlatform('capacitor')) {
      const options = {
        url: capacitorUrl,
        headers: await this.header(),
        data: postData,
      };

      console.time("Perf: POST "+capacitorUrl);

      return from(Http.post(options)).pipe(
        tap((res) => {
          console.timeEnd("Perf: POST "+capacitorUrl);
          const token = res?.headers['vrnaToken'];
          if (token !== undefined && token !== null) {
            this.setToken(token);
          }
        }),
        map((result) => result.data)
      );
    } else {

      console.time("Perf: POST "+url);

      return this.http
        .post<any>(url, postData, {
          observe: 'response',
          headers: await this.header()
        })
        .pipe(
          tap((res) => {

            console.timeEnd("Perf: POST "+url);

            const token = res.headers['vrnaToken'];
            if (token !== undefined && token !== null) {
              this.setToken(token);
            }
          }),
          map((res) => res.body)
        );
    }
  }

  // Delete - HTTP call for capacitor and Web
  async deleteCall(url: string, capacitorUrl: string) {
    if (isPlatform('capacitor')) {
      const options = {
        url: capacitorUrl,
        headers: await this.header(),
      };

      console.time("Perf: DEL "+capacitorUrl);

      return from(Http.del(options)).pipe(
        tap((res) => {

          console.timeEnd("Perf: DEL "+capacitorUrl);

          const token = res?.headers['vrnaToken'];
          if (token !== undefined && token !== null) {
            this.setToken(token);
          }
        }),
        map((result) => result.data)
      );
    } else {

      console.time("Perf: DEL "+url);

      return this.http
        .delete<any>(url, {
          observe: 'response',
          headers: await this.header()
        })
        .pipe(
          tap((res) => {

            console.timeEnd("Perf: DEL "+url);

            const token = res.headers['vrnaToken'];
            if (token !== undefined && token !== null) {
              this.setToken(token);
            }
          }),
          map((res) => res.body)
        );
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async header() {
    let userName = await this.userService.getEmail();
    let macAddress = await this.userService.getUniqueId();
    let vrnaToken = await this.userService.getCurrentToken();
    let country = await this.userService.getCountryCode();

    if (country === null || country === undefined) {      
      country = (await Storage.get({ key: 'user_browser_country' })).value;

      if (country === null || country === undefined) {    
        this.setupCloudflareCountry(environment.baseUrl);
        await this.delay(5000);
        country = (await Storage.get({ key: 'user_browser_country' })).value;  
      }

      // await this.locationService.getLocationPopover().then(async () => {
      //   country = await this.userService.getCountryCode();
      // })
    }

    if(userName == null){
      userName = '';
    }

    if(macAddress == null){
      macAddress = '';
    }

    if(vrnaToken == null){
      vrnaToken = '';
    }

    const headers = {
      'Content-Type': 'application/json',
      userName: userName,
      macAddress: macAddress,
      vrnaToken: vrnaToken,
      country: country,
    };

    return headers;
  }

  async setToken(token: string) {
    await Storage.set({ key: TOKEN_KEY, value: token });
  }
  setheaderValues() {
    let userName = localStorage.getItem('USERNAME_KEY');
    let macAddress = localStorage.getItem('macId');;
    let vrnaToken = localStorage.getItem('TOKEN_KEY');;
    let country = localStorage.getItem('COUNTRY_KEY');;
    if (country === null || country === undefined) {

    }
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('userName', userName);
    headers.append('macAddress', macAddress);
    headers.append('vrnaToken', vrnaToken);
    headers.append('country', country);
    return headers;
  }
}
