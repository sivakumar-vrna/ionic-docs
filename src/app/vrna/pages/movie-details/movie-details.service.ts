import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { MovieDetailsPage } from './movie-details.page';

@Injectable({
    providedIn: 'root'
})

export class MovieDetailsService {

    constructor(
        public modalController: ModalController,
        private router: Router,
    ) { }

    async movieDetailsModal(id: number) {
        const modal = await this.modalController.create({
            component: MovieDetailsPage,
            cssClass: 'movie-details-modal',
            backdropDismiss: true,
            componentProps: {
                'movieId': id,
            }
        });
        await modal.present();

        const { role } = await modal.onDidDismiss();

        this.router.navigate([], {
            queryParams: {
                'id': null,
            },
            queryParamsHandling: 'merge'
        })
    }
}