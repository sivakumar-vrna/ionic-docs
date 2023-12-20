import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatform, PopoverController, ToastController, AlertController } from '@ionic/angular';
import { MustMatch } from 'src/app/shared/directives/must.match';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { StatusBarService } from 'src/app/shared/services/status-bar/status-bar.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import {EventsService} from 'src/app/shared/services/events.service';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signupForm: FormGroup;
  hide = true;
  hideRetype = true;
  isSubmitted = false;
  isLoading = false;
  signupCompleted = false;
  signupMessage: any;
  hasNumber = false;
  hasUpper = false;
  hasLower = false;
  hasSpecialCharacter = false;
  hasMinCharacter = false;
  passwordFocused = false;
  public i18n_SignupPageLabels = {
    email:'Email',
    password: 'Password',
    retype_password: 'Retype Password',
    signup : 'Sign up',
    auth_have_account_already : 'Have account already?',
    auth_signin_toyour_account : 'Sign in to your account'
  }
  public i18n_SignupPageLabels_temp: any;

  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastWidget,
    private authService: AuthService,
    public popoverController: PopoverController,
    public toastController: ToastController,
    private router: Router,
    private statusBar: StatusBarService,
    private errorService: ErrorService,
    public alertController: AlertController,
    private eventsService: EventsService,
    private userService: UserService,
  ) {
    this.i18n_SignupPageLabels_temp = JSON.parse(JSON.stringify(this.i18n_SignupPageLabels));

    //first time on page refresh // translate    
    this.eventsService.subscribe('i18n:layout', (locale) => {
      this.userService.translateLayout(this.i18n_SignupPageLabels, this.i18n_SignupPageLabels_temp, 
        locale);
    });
    
    if (isPlatform('capacitor')) {
      this.statusBar.coloringStatusBar();
    }
  }
  keypressOnEmail(event:KeyboardEvent):void{
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      event.preventDefault();      
    }
  }
  keypressOnPwd(event:KeyboardEvent):void{
    let elem:any;

    if(event.key == 'ArrowUp'){
      event.stopPropagation();       

      elem = document.getElementById('Vrna_logo');      
      elem.focus();

      elem = document.getElementById('id_email_input');      
      elem.focus();

      event.preventDefault();
      
    }        
    if(elem && event.key != 'ArrowUp'){
      event.stopPropagation();       
      elem.focus();
      event.preventDefault();
    }
    if(event.key == 'ArrowLeft'){
      event.stopPropagation();
      event.preventDefault();      
    }
  }

  keypressPwdEye(event:KeyboardEvent){
    let elem:any;
    if(event.key === 'ArrowDown'){
     elem = document.getElementById('ConfirmPwd');
    }
    if (elem) {
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      event.preventDefault();      
    }
  }
  keypressConfirmPwd(event:KeyboardEvent){
     if(event.key == 'ArrowLeft'){
      event.stopPropagation();
      event.preventDefault();      
    }
  }
  keypressConfirmPwdEye(event:KeyboardEvent){
    let elem:any;
    if(event.key === 'ArrowUp'){
     elem = document.getElementById('pwd');
    }
    if (elem) {
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }
  keypressOnSignUpbtn(event:KeyboardEvent):void{
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
    console.time('Perf: IntroPage Screen');
    //alert('signup init');    

    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const firstElem = document.getElementById('id_email_input');   
      firstElem.focus();
    }, 500);

    let user_locale = environment.user_locale;  
    this.userService.translateLayout(this.i18n_SignupPageLabels, this.i18n_SignupPageLabels_temp, 
      user_locale);
    console.timeEnd('Perf: IntroPage Screen');
  }

  get f() {
    return this.signupForm.controls;
  }

  async onSubmit() {
    this.isSubmitted = true;
    if (this.signupForm.valid) {
      this.isLoading = true;
      const macId = await this.authService.uniqueID();
      const registerData = {
        email: this.signupForm.controls.email.value,
        password: this.signupForm.controls.password.value,
        macaddress: macId,
      };
      (await this.authService.onSignup(registerData, macId)).subscribe(res => {
        this.isLoading = false;
        this.isSubmitted = false;
        if (res?.status?.toLowerCase() === 'success' && res?.statusCode == 200) {
          this.signupCompleted = true;
          this.signupForm.reset();

          // this.toast.okSuccess(res.data?.status, `${res.data?.message}. Press okay to login screen`).then(res => {
          // this.toast.okSuccess('Signup email sent successfully','Press okay to go to login screen').then(res => {
            //this.router.navigate(['/auth/login']);
          // });

          //show an alert message and then redirect the user to login page
          this.showAlertMessage('Account Activation Required!', '', 
            'Please check your inbox for an email and follow the instructions in the email to activate your account.');
          

        } else {
          this.errorService.onError(res);
        }
      }, (err) => {
        // this.toast.onFail('Form is not valid');
        this.isLoading = false;
        this.isSubmitted = false;
      });
    } else {
      // this.toast.onFail('Form is not valid');
      this.isLoading = false;
      this.isSubmitted = false;
    }
  }

  async showAlertMessage(title, subtitle, message){

    const alert = await this.alertController.create({
      cssClass: 'user-confirmation',
      header: title,
      subHeader: subtitle,
      message: message,
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
      backdropDismiss: true,

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

    //const { role } = await alert.onDidDismiss();
    //console.log('onDidDismiss resolved with role', role);

  }

  /* Email Error Msg's */
  getEmailErrorMsg() {
    if (this.f.email.hasError('required')) {
      return 'Email is Required';
    }
    return this.f.email.hasError('pattern') ? 'Valid Format is yourname@example.com' : '';
  }

  getPwdErrorMsg() {
    if (this.f.password.hasError('required')) {
      return 'Password is Required';
    }
    if (this.f.password.hasError('pattern')) {
      this.hasNumber = /\d/.test(this.f.password.value);
      this.hasUpper = /[A-Z]/.test(this.f.password.value);
      this.hasLower = /[a-z]/.test(this.f.password.value);
      this.hasSpecialCharacter = /[\!\@\#\$\%\^\&\*\(\)\?\>\<\:\;\"\']/.test(this.f.password.value);
      this.hasMinCharacter = this.f.password.errors.minlength ? false : true;
      return 'Weak Password';
    }
    if (this.f.password.hasError('minLength')) {
      return 'Password must be at least 8 characters';
    }

  }

  getConfirmPwdErrorMsg() {
    if (this.f.confirmPassword.hasError('required')) {
      return 'Confirm Password is Required';
    }

    return this.f.confirmPassword.hasError('MustMatch') ? '' : 'Passwords must match';
    
  }
}
