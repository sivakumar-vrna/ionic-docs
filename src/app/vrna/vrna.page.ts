import { Component, OnInit } from '@angular/core';
import { isPlatform, PopoverController } from '@ionic/angular';
import { StatusBarService } from '../shared/services/status-bar/status-bar.service';
import { Storage } from '@capacitor/storage';
import { LocationService } from '../components/location/location.service';
import { COUNTRY_KEY, OrchService } from './services/ui-orchestration/orch.service';
import { EXPIRY } from '../auth/login/login.page';
import { HttpService } from 'src/app/shared/services/http.service';


@Component({
  selector: 'app-vrna',
  templateUrl: './vrna.page.html',
  styleUrls: ['./vrna.page.scss'],
})
export class VrnaPage implements OnInit {

  constructor(
    private statusBar: StatusBarService,
    private orchService: OrchService,
    public popoverController: PopoverController,
    private locationService: LocationService,
    private httpService: HttpService
  ) {
    if (isPlatform('capacitor')) {
      this.statusBar.coloringStatusBar();
    }else{
      //get and set browser country in the storage

    }
  }

  menuOpened() {
    setTimeout(() => {
      const firstElem = document.getElementById('id_profile_mnu');
      if(firstElem){
        firstElem.focus();
      }      
    }, 400);
  }

  ngOnInit() { 
    console.time('Perf: VrnaPage Screen');
    // const expireAt = localStorage.getItem('expire_at'); 
    const expireAt = Storage.get({ key: EXPIRY });
    if(expireAt){
      this.startExpirationCheck();
    }
  }

  ngAfterViewInit() {

    this.orchService.getAllConfiguration();

    setTimeout(() => {
      this.checkLocation();
    }, 500);

    console.timeEnd('Perf: VrnaPage Screen');
  }

  async checkLocation() {
    const location = (await Storage.get({ key: COUNTRY_KEY }))?.value;
    if (location == null || location === undefined || location == 'null') {
      this.locationService.getLocationPopover().then(async () => {
        this.getCurrentLocation();
      })
    }
  }

  async getCurrentLocation() {
    const location = (await Storage.get({ key: COUNTRY_KEY }))?.value;
    if (!location) {
      this.checkLocation();
    }
  }

  startExpirationCheck() {
    setInterval(() => {
      this.update_rememberme_expiry();
    }, 2 * 60 * 1000); // 2 minutes 
  }

  update_rememberme_expiry() {
    const currentTimestamp = new Date();
    const newExpirationTimestamp = new Date();
    newExpirationTimestamp.setMinutes(newExpirationTimestamp.getMinutes() + 20);
    // localStorage.setItem('expire_at', newExpirationTimestamp.toString()); 
    Storage.set({ key: 'expire_at', value: newExpirationTimestamp.toString() });
    // alert('RememberMe has expired. Updated expire_at to 20 minutes from now.');
  }
}
