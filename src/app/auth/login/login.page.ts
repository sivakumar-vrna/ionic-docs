import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth } from 'src/app/shared/models/auth';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AlertController, isPlatform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { StatusBarService } from 'src/app/shared/services/status-bar/status-bar.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ActivatedRoute } from '@angular/router';
import { Devices } from 'src/app/shared/models/device';
import { DeviceInfoService } from 'src/app/shared/services/device-info/deviceInfo.service';
import { HttpClient } from '@angular/common/http';
import { Device } from '@capacitor/device';
import { Router } from '@angular/router';
import * as UAParser from 'ua-parser-js';
import { Storage } from '@capacitor/storage';
import {EventsService} from 'src/app/shared/services/events.service';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';

export const REMEMBER = 'rememberMe';
export const EXPIRY = 'expire_at';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  hide = true;
  isSubmitted = false;
  ipAddress = '';
  rememberMe: boolean = false;

  public i18n_LoginPageLabels = {
    email: 'Email',
    password: 'Password',
    login:'Login',
    remember_me: 'Remember me',
    forgot_password: 'Forgot password?',
    not_registered_yet: 'Not registered yet?',
    create_an_account: 'Create an Account',
    err_login_pwd_is_required: 'Password is required',
    alert_activation_success_title: 'Welcome to VRNA!',
    alert_activation_success_descr: 'Your registration is verified. Now, login to access your VRNA Plex movie dashboard.',
    alert_user_validation_failed: 'User Validation failed',
    alert_error_header_error: 'Error!',
    alert_error_form_invalid: 'Form is not valid!',
    alert_error_email_is_required: 'Email is required',
    alert_error_valid_email_format: 'Valid Format is yourname@example.com',
    err_login_password_incorrect: 'Password is incorrect. Try again.',
    err_login_email_incorrect: 'Email is incorrect. Try again.'
  }
  public i18n_LoginPageLabels_temp: any;
  
  constructor(
    private formBuilder: FormBuilder,
    private authservice: AuthService,
    public toast: ToastWidget,
    private loadingController: LoadingController,
    private statusBar: StatusBarService,
    private errorService: ErrorService,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private deviceIn: DeviceInfoService,
    private http: HttpClient,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private eventsService: EventsService,
    private userService: UserService,
  ) {

    this.i18n_LoginPageLabels_temp = JSON.parse(JSON.stringify(this.i18n_LoginPageLabels));

    //first time on page refresh // translate    
    this.eventsService.subscribe('i18n:layout', (locale) => {      
      this.userService.translateLayout(this.i18n_LoginPageLabels, this.i18n_LoginPageLabels_temp, 
        locale);      
    });

    if (isPlatform('capacitor')) {
      this.statusBar.coloringStatusBar();
    }
    this.createForm();
    this.route.queryParams.subscribe((params) => {
      const token = params.token;
      if (token) {
        this.presentAlert(token);
      }
    });
  }
  keypressOnEmailInput(event:KeyboardEvent):void{
    let elem:any;
    if(event.key == 'ArrowLeft'){
      elem = document.getElementById('intro_page');
    }
    if(event.key == 'ArrowRight'){
      elem = document.getElementById('input_pwd');
      
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }

  keypressOnPwd(event: KeyboardEvent): void { 
    let elem: any;   
    if(event.key == 'ArrowRight'){
      elem = document.getElementById('input_pwd_eye');
    }
    if(event.key == 'ArrowDown'){
      elem = document.getElementById('Check_box');                  
    }
    
    if(event.key == 'ArrowLeft'){
      event.stopPropagation();
      event.preventDefault();      
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }

  keypressOnPwdEye(event: KeyboardEvent): void { 
    let elem: any;   
    if(event.key == 'ArrowLeft'){
      elem = document.getElementById('input_pwd');           
    }
    if(event.key == 'ArrowDown' || event.key == 'ArrowRight'){
      elem = document.getElementById('Check_box');                  
    }
    if(event.key == 'ArrowUp'){
      elem = document.getElementById('id_email_input');                  
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }
  keypressOnCheckBox(event:KeyboardEvent):void{
    if(event.key == 'ArrowLeft'){
      event.stopPropagation()
      event.preventDefault();
    }
  }
  keypressOnForgot_Pwd(event:KeyboardEvent):void{
    let elem:any;
    if(event.key == 'ArrowLeft'){
       elem = document.getElementById('Check_box');
    }
    if(elem){
      event.stopPropagation();
      elem.focus()
      event.preventDefault();
    }
  }
  keypressOnLoginbtn(event:KeyboardEvent):void{
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
    console.time('Perf: Login Screen');

     

    this.getIPAddress();
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    },
    (err) => {
      console.log("IP ADDRESS Error",err);
    });
  }

  async ngAfterViewInit() {
    setTimeout(() => {
      const firstElem = document.getElementById('id_email_input');
      if(firstElem){
        firstElem.focus();
      }
    }, 2000);

    //translate static labels // on page loads
    let user_locale = environment.user_locale;  
    this.userService.translateLayout(this.i18n_LoginPageLabels, this.i18n_LoginPageLabels_temp, 
      user_locale);
      
    console.timeEnd('Perf: Login Screen');
  }

  async presentAlert(token: string) {
    (await this.authservice.onUserConfirm(token)).subscribe(
      async (res) => {
        if (
          res?.status?.toLowerCase() === 'success' &&
          res?.statusCode == 200
        ) {
          const alert = await this.alertController.create({
            cssClass: 'user-confirmation',
            header: this.i18n_LoginPageLabels.alert_activation_success_title,
            subHeader: '',
            message: this.i18n_LoginPageLabels.alert_activation_success_descr,
            buttons: [
              {
                id: 'alert_btn_ok',
                text: 'OK',
                role: 'cancel',
                cssClass: 'arrow-navigable',
                handler: () => {
                  this.router.navigate(['/auth/login']);
                }
              },
            ],
          });
          await alert.present().then(() => {
            const btnOk: any = document.getElementById('alert_btn_ok');
            btnOk.focus();

            btnOk.addEventListener('keydown', (event: KeyboardEvent) => {
              if(event.key != 'Enter'){
                event.stopPropagation();
                event.preventDefault();
              }
            });

            return;
          });

          //await alert.present();

          // const { role } = await alert.onDidDismiss();
          // console.log('onDidDismiss resolved with role', role);
        } else {
          const alert = await this.alertController.create({
            header: this.i18n_LoginPageLabels.alert_error_header_error,
            message: this.i18n_LoginPageLabels.alert_user_validation_failed,
            buttons: [
              {
                id: 'alert_btn_ok',
                text: 'OK',
                role: 'cancel',
                cssClass: 'arrow-navigable',
              },
            ],
          });
          await alert.present().then(() => {
            const btnOk: any = document.getElementById('alert_btn_ok');
            btnOk.focus();

            btnOk.addEventListener('keydown', (event: KeyboardEvent) => {
              if(event.key != 'Enter'){
                event.stopPropagation();
                event.preventDefault();
              }
            });

            return;
          });

          //this.toast.onFail('User Validation failed');
        }
      },
      (err) => {
        // this.toast.onFail('Error in network');
      }
    );
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      emailOrPhoneNumber: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: new FormControl(false)
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  checkboxValueChanged() {
    const checkboxValue = this.loginForm.controls['rememberMe'].value;
    this.rememberMe = checkboxValue
    console.log('Checkbox value:', this.rememberMe);
  }

  async onSubmit() {
    const loading = await this.loadingController.create();
    this.isSubmitted = true;
    if (this.loginForm.valid) {
      const macId: any = await this.authservice.uniqueID();
      const pwd = btoa(this.loginForm.value.password);

    //for case-Insentive
    const emailOrPhoneNumber = this.loginForm.value.emailOrPhoneNumber.toLowerCase(); 
    const rem = this.rememberMe;
    if (rem) {
      // localStorage.setItem('rememberMe','true')
      Storage.set({ key: REMEMBER, value: 'true' });
    } else {
      // localStorage.setItem('rememberMe','false')
      Storage.set({ key: REMEMBER, value: 'false' });
      const expireAt = new Date();
      expireAt.setMinutes(expireAt.getMinutes() + 20);
      // localStorage.setItem('expire_at',expireAt.toString());
      Storage.set({ key: EXPIRY, value: expireAt.toString() });
    }
    const loginValues: Auth = {
      email: emailOrPhoneNumber,
      phoneNumber: emailOrPhoneNumber,
      password: pwd,
      macAddress: macId,
      rememberMe: rem
    };

      
      //for adding device information

      const user = parseInt(localStorage.getItem('USER_KEY'));
      const getDeviceType = () => {
        const ua = (window as any).navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
          return 'Tablet';
        }
        if (
          /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
            ua
          )
        ) {
          return 'Mobile';
        }
        return 'Desktop';
      };

      const user_agent = (window as any).navigator.userAgent;
      const uap = new UAParser(user_agent);
      const device = uap.getDevice();
      const browser = uap.getBrowser();

      //Possible 'device.type': console, mobile, tablet, smarttv, wearable, embedded     

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
        email: this.loginForm.value.emailOrPhoneNumber,
        userId: user,
        ipAddress: this.ipAddress,
        macAddress: (await Device.getId()).uuid,
        deviceName: device_name,
        deviceType: deviceTypeInfo + ' ' + (await Device.getInfo()).platform,
        deviceOS: os_info,
        geo_from_cloudflare: environment.geo_from_cloudflare
      };

      (await this.authservice.onAuthentication(loginValues, macId)).subscribe(
        async (res) => {
          await loading.dismiss();
          if (
            res?.status?.toLowerCase() === 'success' &&
            res?.statusCode == 200
          ) {
            if (res.data) {
              const userData = res.data;

              deviceData.userId = parseInt(JSON.stringify(userData.userId));

              //update the device info
              this.logDeviceInfo(deviceData);

              this.chRef.detectChanges();
              if (userData.country) {
                await this.authservice.afterLogin(
                  userData,
                  macId,
                  userData.token
                );
              } else {
                await this.authservice.afterLogin(
                  userData,
                  macId,
                  userData.token
                );

                if (this.authservice.isFirstTimeLogin) {
                  this.authservice.isFirstTimeLogin = false;
                  // this.authservice.showFirstTimeLoginToast();
                } else {
                  // await this.authservice.openLocationPopover();
                }
              }  
              
              this.chRef.detectChanges();

            } else {
              this.errorService.onError(res);
            }
          } else {
            let alertMessage = res.message;
            if (res?.message) {
              if (res.message.toLowerCase().includes('password')) {
                alertMessage = this.i18n_LoginPageLabels.err_login_password_incorrect;
              } else if (res.message.toLowerCase().includes('username')) {
                alertMessage = this.i18n_LoginPageLabels.err_login_email_incorrect;
              }
            }
  
            const alert = await this.alertController.create({
              header:'Error!',
              message: alertMessage,
              buttons: [
                {
                  id: 'alert_btn_ok',
                  text: 'OK',
                  role: 'cancel',
                  cssClass: 'arrow-navigable',
                },
              ],
            });
            await alert.present().then(() => {
              const btnOk: any = document.getElementById('alert_btn_ok');
              btnOk.focus();

              btnOk.addEventListener('keydown', (event: KeyboardEvent) => {
                if(event.key != 'Enter'){
                  event.stopPropagation();
                  event.preventDefault();
                }
              });
              
              return;
            });
  
            await alert.present();

          }
          
          this.isSubmitted = false;
        },
        (err) => {
          this.authservice.isAuthenticated.next(false);
          this.router.navigate(['/error/504']);          
          this.isSubmitted = false;
          loading.dismiss();
        }
      );
    } else {

      const alert = await this.alertController.create({
        header: this.i18n_LoginPageLabels.alert_error_header_error,
        message: this.i18n_LoginPageLabels.alert_error_form_invalid,
        buttons: [
          {
            id: 'alert_btn_ok',
            text: 'OK',
            role: 'cancel',
            cssClass: 'arrow-navigable',
          },
        ],
      });
      await alert.present().then(() => {
        const btnOk: any = document.getElementById('alert_btn_ok');
        btnOk.focus();

        btnOk.addEventListener('keydown', (event: KeyboardEvent) => {
          if(event.key != 'Enter'){
            event.stopPropagation();
            event.preventDefault();
          }
        });
        
        return;
      });

      this.isSubmitted = false;
      await loading.dismiss();
    }
  }

  async logDeviceInfo (deviceData) {
    
    //for adding device information
    if (isPlatform('capacitor')) {
      (await this.deviceIn.addCapinfo(deviceData)).subscribe(
        (res) => {
          if (
            res.status.toLowerCase() === 'success' &&
            res.statusCode == 200
          ) { ; }
          this.chRef.detectChanges();
        },
        (err) => { ;  }
      );
    } else {

      //web
      (await this.deviceIn.addDeviceInfo(deviceData)).subscribe(
        (res) => {
          if (
            res.status.toLowerCase() === 'success' &&
            res.statusCode == 200
          ) { ;  }
          this.chRef.detectChanges();
        },
        (err) => { ; }
      );
    }

  }

  /* Email/Phone Number Error Msg */
  getErrorMessage(field: string) {
    if (this.f[field].hasError('required')) {
      return this.i18n_LoginPageLabels.alert_error_email_is_required;
    }
    return '';
  }

  /* Email Error Msg */
  getEmailErrorMsg() {
    if (this.f.emailOrPhoneNumber.hasError('required')) {
      //return 'Email is Required';
    }
    return this.f.emailOrPhoneNumber.hasError('email')
      ? this.i18n_LoginPageLabels.alert_error_valid_email_format
      : '';
  }
}
