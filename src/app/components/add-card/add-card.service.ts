import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddCardComponent } from './add-card.component';
import { IonRouterOutlet } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AddCardService {

  constructor(public modalController: ModalController) { }

  async onAddNewCard() {
    const modal = await this.modalController.create({
      component: AddCardComponent,
      cssClass: 'add-new-card-modal',
      swipeToClose: true,
      animated: true,
    });
    await modal.present();

    const role = await modal.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
    if (role?.data?.newcard) {
      console.log('onDidDismiss resolved with role', role);
      return true;
    }
  }
}
