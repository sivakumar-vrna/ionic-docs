import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatform } from '@ionic/angular';
import { MustMatch } from 'src/app/shared/directives/must.match';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { StatusBarService } from 'src/app/shared/services/status-bar/status-bar.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';

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
  hideRetype = false;
  hide = false;
  resetPwdData: any;
  hasNumber = false;
  hasUpper = false;
  hasLower = false;
  hasSpecialCharacter = false;
  hasMinCharacter = false;
  passwordFocused = false;
  email: string;

  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastWidget,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private statusBar: StatusBarService
  ) {
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

  ngOnInit() { }

  getForm() {
    this.requestForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    /* Password Reset form */
    this.resetForm = this.formBuilder.group({
      token: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  get f() {
    return this.resetForm.controls;
  }

  onRequestSubmit() {
    this.resetSubmitted = true;
    this.isLoading = true;
    const macId = this.authService.uniqueID();
    if (this.requestForm.valid) {
      this.authService.onRequestResetPwd(this.requestForm.value, macId).subscribe(res => {
        console.log(res);
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          this.pwdResetSuccess = true;
          this.resetPwdData = res.data;
          this.email = res.data?.data?.mailId;
        } else {
          this.toast.onFail('Error in Password Reset');
        }
        this.resetSubmitted = false;
        this.isLoading = false;
      }, (err) => {
        this.resetSubmitted = false;
        this.isLoading = false;
        this.toast.onFail('Error in Password Reset');
      });
    } else {
      this.toast.onFail('Form is invalid');
      this.isLoading = false;
    }
  }

  onReset() {
    this.resetSubmitted = true;
    this.isLoading = true;
    if (this.resetForm.valid) {
      const data = {
        email: this.email,
        password: this.resetForm.value.password,
        token: this.resetForm.value.token
      }
      const macId = this.authService.uniqueID();
      this.authService.onResetPwd(data, macId).subscribe(res => {
        console.log(res);
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          this.pwdResetSuccess = false;
          this.toast.onSuccess(res.message);
          this.resetForm.reset();
          this.router.navigate(['/auth/login']);
        } else {
          this.toast.onFail('Error in Password Reset');
        }
        this.resetSubmitted = false;
        this.isLoading = false;
      }, (err) => {
        this.resetSubmitted = false;
        this.toast.onFail('Error in Password Reset');
      });
    } else {
      this.toast.onFail('Form is invalid');
      this.isLoading = false;
    }
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
      return 'Weak Pasword';
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

  resendPassword() {
    const macId = this.authService.uniqueID();
    if (this.requestForm.valid) {
      this.authService.onRequestResetPwd(this.requestForm.value, macId).subscribe(res => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          this.pwdResetSuccess = true;
          this.resetPwdData = res.data;
          this.email = res.data?.data?.mailId;
        } else {
          this.toast.onFail('Error in Password Reset');
        }
      }, err => {
        this.toast.onFail('Error in Password Reset');
      })
    }
  }
}
