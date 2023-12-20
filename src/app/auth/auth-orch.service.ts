import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import {
    AuthService,
    MAC_KEY,
    STRIPE_KEY,
    TOKEN_KEY,
    USERNAME_KEY,
    IMAGE_KEY,
    USER_KEY,
} from '../shared/services/auth/auth.service';
import { ProfileService } from '../shared/services/profile.service';

@Injectable({
    providedIn: 'root',
})
export class AuthCommonService {

    constructor(
        private router: Router,
        public toast: ToastWidget,
        private authservice: AuthService,
        private profileService: ProfileService,
    ) { }

    // #After Successfull login
    async afterLogin(userData: any, macId: any, token: string) {
        Storage.set({ key: USER_KEY, value: JSON.stringify(userData.userId) });        
        Storage.set({ key: USERNAME_KEY, value: userData.email });
        Storage.set({ key: IMAGE_KEY, value: userData.imageUrl });
        Storage.set({ key: STRIPE_KEY, value: userData.stripeId });
        Storage.set({ key: TOKEN_KEY, value: token });
        Storage.set({ key: MAC_KEY, value: macId });
        localStorage.setItem('USER_KEY', JSON.stringify(userData.userId))
        localStorage.setItem('USERNAME_KEY', userData.email)
        localStorage.setItem('IMAGE_KEY', userData.imageUrl)
        localStorage.setItem('STRIPE_KEY', 'userData.stripeId')
        localStorage.setItem('TOKEN_KEY', token)
        localStorage.setItem(MAC_KEY, macId)
        this.authservice.isAuthenticated.next(true);
      
        // await this.router.navigate(['/home']);
        await this.router.navigate(['/switch-profiles']);
    }
}
