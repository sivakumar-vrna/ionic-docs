import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatform, ModalController } from '@ionic/angular';
import { SearchPage } from 'src/app/vrna/pages/search/search.page';
import { themeService, THEME_KEY } from 'src/app/shared/services/theme/theme.service';
import { Storage } from '@capacitor/storage';
import { LocationService } from 'src/app/components/location/location.service';
import { COUNTRIES_KEY, COUNTRY_KEY } from 'src/app/vrna/services/ui-orchestration/orch.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  public isMobile: boolean = false;
  currentTheme: boolean;
  currency: string = '';
  menus = [
    { title: 'Featured', url: '/view-category/featured', icon: 'heart' },
    { title: 'Rented', url: '/view-category/rented', icon: 'albums' },
    { title: 'Latest', url: '/view-category/latest', icon: 'person' }
  ];

  constructor(
    private router: Router,
    public modalController: ModalController,
    private theme: themeService,
    private locationService: LocationService
  ) {
    if (isPlatform('capacitor')) {
      this.isMobile = true;
    }
    this.getCurrentTheme();
    this.getCurrentLocation();
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
    const countries = JSON.parse((await Storage.get({ key: COUNTRIES_KEY }))?.value);
    const location = (await Storage.get({ key: COUNTRY_KEY }))?.value;
    if (!location) {
      this.getLocation();
    }
    this.currency = countries.find((x: any) => x.countryCode === location)?.currency;
  }

  getLocation() {
    this.locationService.getLocationPopover().then(async () => {
      this.getCurrentLocation();
    })
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
    console.log('THeme', this.currentTheme);
    if (e.detail.checked) {
      this.theme.onTheme('dark');
    } else {
      this.theme.onTheme('light');
    }
  }
}
