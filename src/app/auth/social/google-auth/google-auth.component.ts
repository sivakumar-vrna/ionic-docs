import { Component, OnInit, Input } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform, isPlatform, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { AuthCommonService } from '../../auth-orch.service';
import { Device, DeviceInfo } from "@capacitor/device";
import { DeviceInfoService } from 'src/app/shared/services/device-info/deviceInfo.service';
import { Devices } from 'src/app/shared/models/device';
import { HttpClient } from '@angular/common/http';
import * as UAParser from 'ua-parser-js';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.scss'],
})
export class GoogleAuthComponent implements OnInit {
  isSubmitted = false;
  ipAddress = '';
  isAppLoading: any;
  @Input() btnLabel: any;


  constructor(
    private authservice: AuthService,
    public toast: ToastWidget,
    private authCommonService: AuthCommonService,
    public platform: Platform,
    private deviceIn: DeviceInfoService,
    private http:HttpClient,
    private loadingCtrl: LoadingController,
  ) {
    this.initializeApp();
  }
  async ngOnInit() { 
    this.getIPAddress();
  }

  keypressOnGooglebtn(event:KeyboardEvent):void{
    if(event.key == 'ArrowLeft'){
      event.stopPropagation();
      event.preventDefault();      
    }
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      event.preventDefault();      
    }
  }

  getIPAddress(){
    this.http.get("https://api.ipify.org/?format=json").subscribe((res:any)=>{
      this.ipAddress = res.ip;
    });
  }

  async initializeApp() {
    const deviceInfo = await Device.getInfo();
    if ((deviceInfo as unknown as DeviceInfo).platform === "web") {
      this.platform.ready().then(() => {
        GoogleAuth.initialize({
          clientId: '706306776113-i5i82n0gt2os9ijb83aka4sbfmm2b7re.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
          grantOfflineAccess: true,
        });
      })
    }

  }

  async signInWithGoogle() {

    //logout any previous google session;
    try{
      GoogleAuth.signOut().then(() => {
        console.log('Prev google session got logged out now.');
      });
    } catch(err){  ; }

    await GoogleAuth.signIn()
      .then(res => {
        localStorage.setItem('userImage', res.imageUrl)
        this.checkExistingUser(res);
      })
      .catch(err => {
        if (err.error) {
          // this.toast.onFail('Google Sign In popup closed.');
        } else {
          // this.toast.onFail('Error in Google Sign In');
        }
      })
  }

  async checkExistingUser(googleUser) {
    
    //show a loading progress
    try{    
      this.isAppLoading = await this.loadingCtrl.create({
        cssClass: 'my-custom-class',
        message: 'Please wait while logging in...',
      });
      await this.isAppLoading.present();
    } catch(err){}

    const user = {
      email: googleUser.email,
      firstName: googleUser.givenName,
      lastName: googleUser.familyName,
      loginVia: 'google'
    };

    //logout the google session; as the app is taken care with the token
    //this logout is needed for app and TV - to switch to other google user
    GoogleAuth.signOut().then(() => {
      console.log('Google session got logged out now.');
    });

    const macId = await this.authservice.uniqueID();
    this.authservice.onSignup(user, macId).subscribe(
      async (res) => {
        console.log(res);
        if (res.status.toLowerCase() === 'success') {
          const userData = res.data;
          this.authservice.afterLogin(userData, macId, userData.token);
          //for adding device information
          const getDeviceType = () => {  
            const ua = (window as any).navigator.userAgent;  
            if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
                return "tablet";  
              } if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {   
                return "mobile";  
              } return "desktop";
            };

            const userId = parseInt(JSON.stringify(userData.userId));
            const user_agent = (window as any).navigator.userAgent;
            const uap = new UAParser(user_agent);
            const device = uap.getDevice();
            const browser = uap.getBrowser();
          
            let deviceTypeInfo: any;
            let os_info: any;
            let device_name: any;
            if (isPlatform('capacitor')) {
              deviceTypeInfo = device.type;
              os_info = (await Device.getInfo()).operatingSystem;
              device_name = (await Device.getInfo()).name + ' ' + 
              (await Device.getInfo()).manufacturer + ' ' + (await Device.getInfo()).model;
            }else{
              deviceTypeInfo = getDeviceType();
              let browser_os = uap.getOS();
              os_info = browser_os.name + ' ' + browser_os.version;
              device_name = browser.name + ' ' + browser.version;
            }

          const deviceData: Devices = {
            email: user.email,
            userId: userId,
            ipAddress: this.ipAddress,
            macAddress: (await Device.getId()).uuid,
            deviceName: device_name,
            deviceType: deviceTypeInfo + ' ' + (await Device.getInfo()).platform,
            deviceOS: os_info,
            geo_from_cloudflare: environment.geo_from_cloudflare
          };
          if (isPlatform('capacitor')){
            (await this.deviceIn.addCapinfo(deviceData)).subscribe(
              (res) => {
              if (res.status.toLowerCase() === 'success' && res.statusCode == 200) { ;  }
            }, (err) => { ; }
            )
          }else{
            (await this.deviceIn.addDeviceInfo(deviceData)).subscribe(
              (res) => {
              if (res.status.toLowerCase() === 'success' && res.statusCode == 200) { ; }
            }, (err) => { ; }
            )
          }
        } else {
          // this.toast.onFail('Error Signing in via social login');
        }
        this.isSubmitted = false;

        if(this.isAppLoading){
          this.isAppLoading.dismiss();
        }

      },
      (err) => {
        this.isSubmitted = false;
        // this.toast.onFail(err);

        if(this.isAppLoading){
          this.isAppLoading.dismiss();
        }
      });
  }
}
