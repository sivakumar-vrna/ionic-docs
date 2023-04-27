import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UiRentDataService } from 'src/app/vrna/services/ui-orchestration/ui-rent-data.service';
import { RentComponent } from './rent.component';

@Injectable({
  providedIn: 'root'
})
export class RentService {

  constructor(
    public modalController: ModalController,
    private orchRentService: UiRentDataService
  ) { }

  async onRent(data) {
    console.log(data);
    const modal = await this.modalController.create({
      component: RentComponent,
      cssClass: 'rent-modal',
      componentProps: {
        'contentData': data
      }
    });


    modal.onDidDismiss().then((modelData) => {
      if (modelData.data) {
        this.orchRentService.userRentedMovies();
        console.log('Modal Data Success: ' + modelData.data);
      }
    });
    return await modal.present();
  }

}
