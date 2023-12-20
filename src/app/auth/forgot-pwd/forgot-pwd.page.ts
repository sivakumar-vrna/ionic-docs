import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators,AbstractControl, ValidationErrors} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatform, AlertController } from '@ionic/angular';
import { MustMatch } from 'src/app/shared/directives/must.match';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { StatusBarService } from 'src/app/shared/services/status-bar/status-bar.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import {EventsService} from 'src/app/shared/services/events.service';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-forgot-pwd',
  templateUrl: './forgot-pwd.page.html',
  styleUrls: ['./forgot-pwd.page.scss'],
})
export class ForgotPwdPage implements OnInit {

  requestForm: FormGroup;
  resetSubmitted = false;
  pwdResetSuccess = false;
  resetForm: FormGroup;
  isLoading = false;
  hideRetype = true;
  hide = true;
  resetPwdData: any;
  hasNumber = false;
  hasUpper = false;
  hasLower = false;
  hasSpecialCharacter = false;
  hasMinCharacter = false;
  passwordFocused = false;
  email: string;

  public i18n_FpwdPageLabels = {
    email: 'Email',
    password: 'Password',
    reset_password:'Reset Password',
    not_registeredd_yet: 'Not registered yet',
    back_to_login: 'Back to Login',
    confirm_password: 'Confirm Password',
    resend_code: 'Resend Code',
    pwd_reset_token:'Password Reset Token',
    create_an_account: 'Create an Account'
  }
  public i18n_FpwdPageLabels_temp: any;

  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastWidget,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private statusBar: StatusBarService,
    public alertController: AlertController,
    private eventsService: EventsService,
    private userService: UserService,

  ) {
    this.i18n_FpwdPageLabels_temp = JSON.parse(JSON.stringify(this.i18n_FpwdPageLabels));

    //first time on page refresh // translate   
    this.eventsService.subscribe('i18n:layout', (locale) => {      
      this.userService.translateLayout(this.i18n_FpwdPageLabels, this.i18n_FpwdPageLabels_temp, 
        locale);      
    });


    if (isPlatform('capacitor')) {
      this.statusBar.coloringStatusBar();
    }
    this.getForm();
    this.route.queryParams.subscribe((params) => {
      const token = params.token;
      if (token) {
        this.pwdResetSuccess = true;
        this.resetForm.patchValue({ token: token });
      }
    });
  }


  
  keypressOnInput(event: KeyboardEvent): void { 
    let elem: any;   
    if(event.key == 'ArrowDown'){
      elem = document.getElementById('btnSubmit');                  
    }
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      event.preventDefault();      
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
  keypressOnSubmitbtn(event: KeyboardEvent): void { 
    
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      event.preventDefault();      
    }
    if(event.key == 'ArrowLeft'){
      event.stopPropagation();
      event.preventDefault();      
    }
    
  }
  keypressOnTokenInput(event:KeyboardEvent): void{
    let elem:any;
    if(event.key === 'ArrowDown'){
      elem = document.getElementById('resendcode')
    }
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      event.preventDefault();      
    }
    if(event.key == 'ArrowLeft'){
      elem = document.getElementById('intro_page');
    }
    if (elem) {
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
    
  }

  keypressOnPwdInput(event: KeyboardEvent): void {
    let elem: any;
    if (event.key === 'ArrowUp') {
      elem = document.getElementById('resendcode');
    }
    if (elem) {
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }
  keypreescode(event:KeyboardEvent){
    let elem :any;
    if(event.key === 'ArrowDown'){
      elem = document.getElementById('pwd')
    }
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      event.preventDefault();      
    }
    if(event.key == 'ArrowLeft'){
      event.stopPropagation();
      event.preventDefault();      
    }
    if (elem) {
      event.stopPropagation();
      elem.focus();
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
  }
  keypressConfirmPwd(event:KeyboardEvent):void{
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
  keypressOnPwd(event:KeyboardEvent):void{
    let elem:any;

    if(event.key == 'ArrowUp'){
      event.stopPropagation();       

      elem = document.getElementById('Vrna_logo');      
      elem.focus();

      elem = document.getElementById('pwd');      
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
  keypressConfirmSubmit(event:KeyboardEvent):void{
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
    console.time('Perf: ForgotPwd Screen');
    this.getForm();

  }

  ngAfterViewInit() {
    setTimeout(() => {
      const firstElem = document.getElementById('id_email_input');
      if(firstElem){
        firstElem.focus();
      }
    }, 500);

    let user_locale = environment.user_locale;  
    this.userService.translateLayout(this.i18n_FpwdPageLabels, this.i18n_FpwdPageLabels_temp, 
      user_locale);
    console.timeEnd('Perf: ForgotPwd Screen');
  }

  getForm() {
    this.requestForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]

    });

    /* Password Reset form */
    this.resetForm = this.formBuilder.group({
      token: ['', [Validators.required, this.trimSpacesToken]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  /* token spece trim*/
  trimSpacesToken(control: AbstractControl): ValidationErrors | null {
    const tokenValue = control.value;
    if (tokenValue && typeof tokenValue === 'string') {
      const trimmedToken = tokenValue.trim();
      if (trimmedToken !== tokenValue) {
        control.setValue(trimmedToken); // Trim and set the trimmed value back to the form control
        return { trimSpaces: true };
      }
    }
    return null;
  }
  

  get f() {
    return this.resetForm.controls;
  }

  async onRequestSubmit() {
    this.resetSubmitted = true;
    this.isLoading = true;
    const macId = await this.authService.uniqueID();
    if (this.requestForm.valid) {
      const email = this.requestForm.value.email.toLowerCase();
      const requestData = { ...this.requestForm.value, email }
      this.authService.onRequestResetPwd(requestData, macId).subscribe(res => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          this.pwdResetSuccess = true;
          setTimeout(() => {
            const firstElem = document.getElementById('id_token_input');
            if(firstElem){
              firstElem.focus();
            }
          }, 300);
          this.resetPwdData = res.data;
          this.email = res.data?.data?.mailId;
        } else {
          this.showErrorMessage(res.message);      
        }
        this.resetSubmitted = false;
        this.isLoading = false;
      }, (err) => {
        this.resetSubmitted = false;
        this.isLoading = false;
        // this.toast.onFail('Error in Password Reset');
      });
    } else {
      // this.toast.onFail('Form is invalid');
      this.isLoading = false;
    }
  }

  async showErrorMessage(message){
    const alert = await this.alertController.create({
      header:'Error!',
      message: message,
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

  async onReset() {
    this.resetSubmitted = true;
    this.isLoading = true;
    if (this.resetForm.valid) {
      const data = {
        email: this.email,
        password: this.resetForm.value.password,
        token: this.resetForm.value.token
      }
      const macId = await this.authService.uniqueID();
      this.authService.onResetPwd(data, macId).subscribe(res => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          this.pwdResetSuccess = false;
          // this.toast.onSuccess(res.message);
          this.showAlertMessage('Success!', 'Password Reset', 'Your password has been reset successfully.');

          this.resetForm.reset();
          this.router.navigate(['/auth/login']);
        } else {
          this.FailAlertMessage('Password Reset Token',res.message,'');
        }
        this.resetSubmitted = false;
        this.isLoading = false;
      }, (err) => {
        this.resetSubmitted = false;
        this.FailAlertMessage('','Error in Password Reset','');
      });
    } else {
      // this.toast.onFail('Form is invalid');
      this.FailAlertMessage('', 'Form is invalid', 'Enter the correct details');

      this.isLoading = false;
    }
  }


  async showAlertMessage(title: string, subtitle: string, message: string) {
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
        if (event.key !== 'Enter') {
          event.stopPropagation();
          event.preventDefault();
        }
      });
  
      return;
    });
  }

  async FailAlertMessage(title: string, subtitle: string, message: string) {
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
          
        },
      ],
      backdropDismiss: true,
    });
  
    await alert.present().then(() => {
      const btnOk: any = document.getElementById('alert_btn_ok');
      btnOk.focus();
  
      btnOk.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key !== 'Enter') {
          event.stopPropagation();
          event.preventDefault();
        }
      });
  
      return;
    });
  }
  

  getEmailErrorMsg() {
    if (this.requestForm.controls.email.hasError('required')) {
      return 'Email is Required';
    }

    return this.requestForm.controls.email.hasError('email') ? 'Not a valid email' : '';
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
      return 'Password is Required';
    }

    return this.f.confirmPassword.hasError('MustMatch') ? '' : 'Passwords must match';
  }

  async resendPassword() {
    const macId = await this.authService.uniqueID();
    if (this.requestForm.valid) {
      this.authService.onRequestResetPwd(this.requestForm.value, macId).subscribe(res => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          this.pwdResetSuccess = true;
          this.resetPwdData = res.data;
          this.email = res.data?.data?.mailId;

          //re-focus the element
          let elem = document.getElementById('id_token_input');
          elem.focus();
        } else {
          //this.toast.onFail(res.message);

          let elem = document.getElementById('id_token_input');
          elem.focus();
        }
      }, err => {
        // this.toast.onFail('Error in Password Reset');
        let elem = document.getElementById('id_token_input');
        elem.focus();
      })
    }
  }
}
