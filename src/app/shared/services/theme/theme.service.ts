import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { StatusBarService } from '../status-bar/status-bar.service';

export const THEME_KEY = 'theme';

@Injectable({
    providedIn: 'root'
})
export class themeService {

    constructor(private statusBar: StatusBarService) { }

    onTheme(e: 'dark' | 'light') {
        Storage.set({ key: THEME_KEY, value: e });
        document.body.setAttribute('color-theme', e);
        this.statusBar.coloringStatusBar();
    }
}