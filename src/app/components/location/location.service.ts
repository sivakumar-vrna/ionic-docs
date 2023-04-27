import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LocationComponent } from './location.component';

@Injectable({
  providedIn: 'root'
})

export class LocationService {

  constructor(
    public modalController: ModalController
  ) { }

  async getLocationPopover() {
    const popover = await this.modalController.create({
      component: LocationComponent,
      cssClass: 'choose-location',
      backdropDismiss: false
    });
    await popover.present();

    const { } = await popover.onDidDismiss();
    console.log('location is closed');
  }

}
