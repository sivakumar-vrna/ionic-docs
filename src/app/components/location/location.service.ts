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

  async getLocationPopover(isManualLocPopTrigger:boolean = false) {
    const popover = await this.modalController.create({
      component: LocationComponent,
      componentProps: {
        isManualLocPopTrigger: isManualLocPopTrigger,
      },
      cssClass: 'choose-location',
      backdropDismiss: false
    });

    popover.onDidDismiss()
    .then(() => {
      let elem: any;
      elem = document.getElementById('managebtn');
      if(!elem){
        elem = document.getElementById('bannerMain');
      }
      if(!elem){
        elem = document.getElementById('btnMnu');
      }
      if(elem){
        elem.focus();
      }
    })
    .catch(console.log);


    
    await popover.present();

    const { } = await popover.onDidDismiss();
  }

}
