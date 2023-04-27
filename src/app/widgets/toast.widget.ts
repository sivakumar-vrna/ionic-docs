import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToastWidget {

    constructor(
        public toastController: ToastController,
        public loadingController: LoadingController
    ) { }

    async onSuccess(msg: string) {
        const toast = await this.toastController.create({
            header: 'Hurray!!!',
            message: msg,
            position: 'bottom',
            animated: true,
            color: 'success',
            duration: 3000
        });
        toast.present();
    }

    async okSuccess(header: string, msg: string) {
        const toast = await this.toastController.create({
            header: header,
            message: msg,
            position: 'bottom',
            animated: true,
            color: 'success',
            buttons: [
                {
                    side: 'start',
                    icon: 'close',
                },
                {
                    text: 'Okay',
                    role: 'ok',
                }
            ]
        });
        await toast.present();
        const { role } = await toast.onDidDismiss();
        return role;
    }

    async onWaring(msg: string) {
        const toast = await this.toastController.create({
            header: 'Alert!!!',
            message: msg,
            position: 'bottom',
            animated: true,
            color: 'secondary',
            duration: 3000
        });
        toast.present();
    }

    async onFail(msg: string, statusCode?: string) {
        const toast = await this.toastController.create({
            header: '',
            message: msg,
            position: 'bottom',
            animated: true,
            color: 'danger',
            duration: 9999,
            buttons: [
                {
                    side: 'start',
                    icon: 'close',
                },
                {
                    text: 'Okay',
                    role: 'cancel',
                }
            ]
        });
        toast.present();
    }

    async dismissOnFail() {
        await this.toastController.dismiss();
    }
}
