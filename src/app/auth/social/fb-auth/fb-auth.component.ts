import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { FacebookLogin, FacebookLoginResponse } from '@capacitor-community/facebook-login';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { AuthCommonService } from '../../auth-orch.service';
import { Plugins } from '@capacitor/core';
import { NavigationExtras } from '@angular/router';
import { DeviceInfoService } from 'src/app/shared/services/device-info/deviceInfo.service';
import { HttpClient } from '@angular/common/http';
import { isPlatform } from '@ionic/angular';
import { Devices } from 'src/app/shared/models/device';
import { Device } from '@capacitor/device';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-fb-auth',
  templateUrl: './fb-auth.component.html',
  styleUrls: ['./fb-auth.component.scss'],
})
export class FbAuthComponent implements OnInit {
  isSubmitted = false;
  ipAddress = '';
  @Input() btnLabel: any;


  constructor(
    public toast: ToastWidget,
    private authservice: AuthService,
    private authCommonService: AuthCommonService,
    private deviceIn: DeviceInfoService,
    private http:HttpClient
  ) { }

  keypressOnFBbtn(event:KeyboardEvent):void{
    if(event.key == 'ArrowLeft'){
      event.stopPropagation();
      event.preventDefault();      
    }
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      event.preventDefault();      
    }
  }

  ngOnInit() { 
    this.getIPAddress();
  }


  getIPAddress(){
    this.http.get("https://api.ipify.org/?format=json").subscribe((res:any)=>{
      this.ipAddress = res.ip;
    });
  }

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
    if (result && result.accessToken) {

    }
    this.getCurrentState();
  }

  async checkExistingUser(googleUser) {
    const user = {
      email: googleUser.email,
      firstName: googleUser.name,
      lastName: googleUser.name,
      loginVia: 'facebook'
    };
    const macId = await this.authservice.uniqueID();
    this.authservice.onSignup(user, macId).subscribe(
      async (res) => {
        if (res.status.toLowerCase() === 'success') {
          const userData = res.data;
          this.authservice.afterLogin(userData, macId, userData.token);
          //for adding device information
          const user1 = parseInt(localStorage.getItem("USER_KEY"));
          const getDeviceType = () => {  
            const ua = (window as any).navigator.userAgent;  
            if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
                return "tablet";  
              } if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {   
                return "mobile";  
              } return "desktop";
            };
          const deviceData: Devices = {
            email: user.email,
            userId: user1,
            ipAddress: this.ipAddress,
            macAddress: (await Device.getId()).uuid,
            deviceName: (await Device.getInfo()).model,
            deviceType: getDeviceType(),
            deviceOS: (await Device.getInfo()).operatingSystem,
            geo_from_cloudflare: environment.geo_from_cloudflare
          };
      if (isPlatform('capacitor')){
        (await this.deviceIn.addCapinfo(deviceData)).subscribe(
          (res) => {
           if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
           }
         }, (err) => {
          // alert(err);
         }
        )
      }else{
        //web
          (await this.deviceIn.addDeviceInfo(deviceData)).subscribe(
          (res) => {
           if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
           }
         }, (err) => {
         }
        )
      }
        } else {
        }
        this.isSubmitted = false;
      },
      (err) => {
        this.isSubmitted = false;
        // this.toast.onFail(err);
      });
  }


  async getEmail() {
    const result = await FacebookLogin.getProfile<{
      email: string;
    }>({
      fields: ['email'],
    }).catch(() => undefined);
    if (result === undefined) {
      return null;
    }

  }

  async getCurrentState() {
    const result = await Plugins.FacebookLogin.getCurrentAccessToken();
    try {
      if (result && result.accessToken) {
        // let user = { token: result.accessToken.token, userId: result.accessToken.userId }
        this.getUserInfo(result.accessToken.token, result.accessToken.userId)
      }
    } catch (e) {
    }
  }

  async signIn(): Promise<void> {
    const FACEBOOK_PERMISSIONS = ['public_profile', 'email'];

    const result = await Plugins.FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
    if (result && result.accessToken) {
      let user = { token: result.accessToken.token, userId: result.accessToken.userId }
      let navigationExtras: NavigationExtras = {
        queryParams: {
          userinfo: JSON.stringify(user)
        }
      };
      //  this.router.navigate(["/home"], navigationExtras);
    }
  }

  async getUserInfo(toeken, userId) {
    const response = await fetch(`https://graph.facebook.com/${userId}?fields=id,name,email,gender,link,picture&type=large&access_token=${toeken}`);
    const myJson = await response.json();
    this.checkExistingUser(myJson)
  }
}
