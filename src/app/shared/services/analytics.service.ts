import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


// Init for the web
//import "@capacitor-community/firebase-analytics";
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';


//import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics";

//import { Device } from '@capacitor/device';



//import { Plugins } from '@capacitor/core';

//const { FirebaseAnalytics, Device } = Plugins;

/*

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  analyticsEnabled = true;

  constructor(private router: Router) { 
    this.initFb();
    this.router.events.pipe(
      filter((e: RouterEvent) => e instanceof NavigationEnd),
    ).subscribe((e: RouterEvent) => {
      console.log('route changed: ', e.url);
      this.setScreenName(e.url)
    });
  }

  async initFb() {
    if ((await Device.getInfo()).platform == 'web') {
      FirebaseAnalytics.initializeFirebase(environment.firebase);
    }
  }

  setUser(sesUserID) {
    // Use Firebase Auth uid
    FirebaseAnalytics.setUserId({
      userId: sesUserID,
    });
  }

  setProperty(prop_name, prop_val) {
    FirebaseAnalytics.setUserProperty({
      name: prop_name,
      value: prop_val,
    });
  }

  logEvent(key, val) {
    FirebaseAnalytics.logEvent({
      name: key,
      params: {
        method: val
      }
    });
  }

  setScreenName(screenName) {
    FirebaseAnalytics.setScreenName({
      screenName
    });
  }

  toggleAnalytics() {
    this.analyticsEnabled = !this.analyticsEnabled;
    FirebaseAnalytics.setCollectionEnabled({
      enabled: this.analyticsEnabled,
    });
  }




}

*/
