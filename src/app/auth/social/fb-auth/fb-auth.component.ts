import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { FacebookLogin, FacebookLoginResponse } from '@capacitor-community/facebook-login';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { AuthCommonService } from '../../auth-orch.service';
import { Plugins } from '@capacitor/core';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-fb-auth',
  templateUrl: './fb-auth.component.html',
  styleUrls: ['./fb-auth.component.scss'],
})
export class FbAuthComponent implements OnInit {
  isSubmitted = false;
  constructor(
    public toast: ToastWidget,
    private authservice: AuthService,
    private authCommonService: AuthCommonService,
  ) { }

  ngOnInit() { }

  signInWithFB(): void {
    this.fbSignIn();
  }

  async fbSignIn(): Promise<void> {
    this.getEmail();
    const FACEBOOK_PERMISSIONS = [
      'public_profile', 'email'
    ];

    const result = await FacebookLogin.login({
      permissions: FACEBOOK_PERMISSIONS,
    });
    console.log(result);
    if (result && result.accessToken) {

    }
    this.getCurrentState();
  }

  checkExistingUser(googleUser) {
    console.log(googleUser)
    const user = {
      email: googleUser.email,
      firstName: googleUser.name,
      lastName: googleUser.name,
      loginVia: 'facebook'
    };
    const macId = this.authservice.uniqueID();
    this.authservice.onSignup(user, macId).subscribe(
      (res) => {
        console.log(res);
        if (res.status.toLowerCase() === 'success') {
          const userData = res.data;
          this.authCommonService.afterLogin(userData, macId, res.token);
        } else {
          this.toast.onFail('Error Signing in via social login');
        }
        this.isSubmitted = false;
      },
      (err) => {
        this.isSubmitted = false;
        this.toast.onFail(err);
      });
  }


  async getEmail() {
    const result = await FacebookLogin.getProfile<{
      email: string;
    }>({
      fields: ['email'],
    }).catch(() => undefined);
    console.log(result);
    if (result === undefined) {
      return null;
    }

  }

  /* async getCurrentState() {
     const result = await FacebookLogin.getCurrentAccessToken().catch(() => undefined);
     console.log(result);
   } */


  async getCurrentState() {
    const result = await Plugins.FacebookLogin.getCurrentAccessToken();
    try {
      console.log(result);
      if (result && result.accessToken) {
        let user = { token: result.accessToken.token, userId: result.accessToken.userId }
        console.log(user)
        this.getUserInfo(result.accessToken.token, result.accessToken.userId)
      }
    } catch (e) {
      console.log(e)
    }
  }

  async signIn(): Promise<void> {
    const FACEBOOK_PERMISSIONS = ['public_profile', 'email'];

    const result = await Plugins.FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
    if (result && result.accessToken) {
      let user = { token: result.accessToken.token, userId: result.accessToken.userId }
      // this.getUserInfo(user)
      let navigationExtras: NavigationExtras = {
        queryParams: {
          userinfo: JSON.stringify(user)
        }
      };
      //  this.router.navigate(["/home"], navigationExtras);
    }
  }

  async getUserInfo(toeken, userId) {
    console.log(toeken)
    const response = await fetch(`https://graph.facebook.com/${userId}?fields=id,name,email,gender,link,picture&type=large&access_token=${toeken}`);
    const myJson = await response.json();
    console.log(myJson)
    this.checkExistingUser(myJson)
    // this.user = myJson
  }
}
