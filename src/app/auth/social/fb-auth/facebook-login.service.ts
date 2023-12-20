import { Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';

@Injectable({
  providedIn: 'root'
})
export class FacebookLoginService {

  constructor(private fb: Facebook) {}

  login(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fb.login(['public_profile', 'email'])
        .then(response => {
          if (response.status === 'connected') {
            resolve(response.authResponse.accessToken);
          } else {
            reject('Facebook login failed');
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  getProfileInfo(): Promise<any> {
    return this.fb.api('/me?fields=id,name,email', ['email']);
  }

  logout(): Promise<any> {
    return this.fb.logout();
  }
}
