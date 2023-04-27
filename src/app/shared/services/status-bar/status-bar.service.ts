import { Injectable, Input } from '@angular/core';
import { BackgroundColorOptions, StatusBar, Style } from '@capacitor/status-bar';
import { isPlatform } from '@ionic/core';
import { Storage } from '@capacitor/storage';
import { THEME_KEY } from '../theme/theme.service';

@Injectable({
  providedIn: 'root'
})
export class StatusBarService {

  constructor() { }

  async coloringStatusBar() {
    const tempData = await Storage.get({ key: THEME_KEY });
    const theme = tempData.value;

    if (isPlatform('capacitor')) {
      if (theme === 'light') {
        const options: BackgroundColorOptions = {
          color: '#edf0f4'
        }
        StatusBar.setBackgroundColor(options);
        StatusBar.setStyle({ style: Style.Light });
      } else {
        const options: BackgroundColorOptions = {
          color: '#2f2f2f'
        }
        StatusBar.setBackgroundColor(options);
        StatusBar.setStyle({ style: Style.Dark });
      }
    }
  }
}
