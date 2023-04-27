import { Component, OnInit } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { AuthCommonService } from '../../auth-orch.service';
import { Device, DeviceInfo } from "@capacitor/device";

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.scss'],
})
export class GoogleAuthComponent implements OnInit {
  isSubmitted = false;
  constructor(
    private authservice: AuthService,
    public toast: ToastWidget,
    private authCommonService: AuthCommonService,
    public platform: Platform
  ) {
    this.initializeApp();
  }

  ngOnInit() { }

  async initializeApp() {
    const deviceInfo = await Device.getInfo();
    if ((deviceInfo as unknown as DeviceInfo).platform === "web") {
      this.platform.ready().then(() => {
        GoogleAuth.init();
      })
    }

  }

  async signInWithGoogle() {
    console.log('Google Signin');
    await GoogleAuth.signIn()
      .then(res => {
        console.log(res);
        console.log(res.imageUrl);
        localStorage.setItem('userImage', res.imageUrl)
        this.checkExistingUser(res);
      })
      .catch(err => {
        console.log(err);
        if (err.error) {
          this.toast.onFail('Google Sign In popup closed.');
        } else {
          this.toast.onFail('Error in Google Sign In');
        }
      })
  }

  checkExistingUser(googleUser) {
    const user = {
      email: googleUser.email,
      firstName: googleUser.givenName,
      lastName: googleUser.familyName,
      loginVia: 'google'
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

}
