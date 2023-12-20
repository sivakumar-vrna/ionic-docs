import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { isPlatform } from '@ionic/angular';
export const INTRO_KEY = 'intro-seen';

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {
  constructor(private router: Router) { }
  async canLoad(
    route: Route,
    segments: UrlSegment[]): Promise<boolean> {
    const hasSeenIntro = await Storage.get({ key: INTRO_KEY });
    //let hasSeenIntro:any = {};
    if (isPlatform('capacitor')) {
      if (hasSeenIntro && (hasSeenIntro.value === 'true')) {
        return true;
      } else {
        this.router.navigateByUrl('/intro', { replaceUrl: true });
        return false;
      }
    } else {
      return true;
    }
  }
}
