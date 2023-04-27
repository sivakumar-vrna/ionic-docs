import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatform, PopoverController, ToastController } from '@ionic/angular';
import { MustMatch } from 'src/app/shared/directives/must.match';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { StatusBarService } from 'src/app/shared/services/status-bar/status-bar.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signupForm: FormGroup;
  hide = false;
  hideRetype = false;
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

  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastWidget,
    private authService: AuthService,
    public popoverController: PopoverController,
    public toastController: ToastController,
    private router: Router,
    private statusBar: StatusBarService,
    private errorService: ErrorService
  ) {
    if (isPlatform('capacitor')) {
      this.statusBar.coloringStatusBar();
    }
  }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  async onSubmit() {
    this.isSubmitted = true;
    if (this.signupForm.valid) {
      this.isLoading = true;
      const macId = this.authService.uniqueID();
      const registerData = {
        email: this.signupForm.controls.email.value,
        password: this.signupForm.controls.password.value,
        macaddress: macId,
      };
      (await this.authService.onSignup(registerData, macId)).subscribe(res => {
        console.log(res);
        this.isLoading = false;
        this.isSubmitted = false;
        if (res?.status?.toLowerCase() === 'success' && res?.statusCode == 200) {
          this.signupCompleted = true;
          this.toast.okSuccess(res.data?.status, `${res.data?.message}. Press okay to login screen`).then(res => {
            if (res === 'ok') {
              this.router.navigate(['/auth/login']);
            }
          });
          this.signupForm.reset();
        } else {
          this.errorService.onError(res);
        }

      }, (err) => {
        this.toast.onFail('Form is not valid');
        this.isLoading = false;
        this.isSubmitted = false;
      });
    } else {
      this.toast.onFail('Form is not valid');
    }
  }



  /* Email Error Msg's */
  getEmailErrorMsg() {
    if (this.f.email.hasError('required')) {
      return 'Email is Required';
    }
    return this.f.email.hasError('email') ? 'Valid Format is yourname@example.com' : '';
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
      return 'Weak Pasword';
    }
    if (this.f.password.hasError('minLength')) {
      return 'Password must be at least 8 characters';
    }

  }

  getConfirmPwdErrorMsg() {
    if (this.f.confirmPassword.hasError('required')) {
      return 'Passwords must match';
    }

    return this.f.confirmPassword.hasError('MustMatch') ? '' : 'Passwords must match';
  }
}
