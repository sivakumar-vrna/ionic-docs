import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Storage } from '@capacitor/storage';
import { themeService, THEME_KEY } from './shared/services/theme/theme.service';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Geolocation } from '@capacitor/geolocation';
import { CommonService } from './shared/services/common.service';
import { COUNTRY_KEY } from './vrna/services/ui-orchestration/orch.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {

  constructor(
    private theme: themeService,
    private platform: Platform,
    private commonService: CommonService
  ) {
    this.onLoadTheme();
    this.getLocation();
  }

  async onLoadTheme() {
    const theme: any = await Storage.get({ key: THEME_KEY });
    this.theme.onTheme(theme.value);
  }

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(5, () => {
      if (window.confirm("Do you want to exit app?")) {
        {
          App.exitApp();
        }
      }
    });
  }

  async getLocation() {
    const country: string = (await Storage.get({ key: COUNTRY_KEY })).value;
    if (country === null || country === undefined) {
      this.commonService.getLocation();
    }
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current position:', coordinates);
  }

  async ngAfterViewInit() {
    SplashScreen.show({
      showDuration: 2000,
      autoHide: true
    });
  }
}
