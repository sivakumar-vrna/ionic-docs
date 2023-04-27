import { Component, OnInit } from '@angular/core';
import { isPlatform, PopoverController } from '@ionic/angular';
import { StatusBarService } from '../shared/services/status-bar/status-bar.service';
import { Storage } from '@capacitor/storage';
import { LocationService } from '../components/location/location.service';
import { COUNTRY_KEY, OrchService } from './services/ui-orchestration/orch.service';

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
  ) {
    if (isPlatform('capacitor')) {
      this.statusBar.coloringStatusBar();
    }
    this.orchService.getAllConfiguration();
    this.checkLocation();
  }

  ngOnInit() { }

  async checkLocation() {
    const location = (await Storage.get({ key: COUNTRY_KEY }))?.value;
    if (location === null || location === undefined) {
      this.locationService.getLocationPopover();
    }
  }

}
