import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { StatusBarService } from 'src/app/shared/services/status-bar/status-bar.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';

@Component({
  selector: 'app-ph-pwd',
  templateUrl: './ph-pwd.component.html',
  styleUrls: ['./ph-pwd.component.scss'],
})
export class PhPwdComponent implements OnInit {
  pwdForm: FormGroup;
  hide = false;
  hideRetype = false;
  isSubmitted = false;
  isLoading = false;
  pwdCompleted = false;
  pwdMessage: any;
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
    private router: Router,
    private statusBar: StatusBarService,
    private errorService: ErrorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.pwdForm = this.formBuilder.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/),
        ],
      ],
      confirmPassword: ['', Validators.required],
    });
  
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || localStorage.getItem('email');
      this.pwdForm.patchValue({
        email: this.email,
      });

  
      const registerData = JSON.parse(localStorage.getItem('registerData') || '{}');
      if (registerData.email === this.email) {
        this.pwdForm.controls.email.disable();
      }
    });
  }

  get f() {
    return this.pwdForm.controls;
  }

  async onSubmit() {
    this.isSubmitted = true;
    if (this.pwdForm.valid) {
      // Form is valid, proceed with registration
      this.isLoading = true;
      const macId = await this.authService.uniqueID();
  
      const registerData = {
        email: this.email,
        password: this.pwdForm.controls.password.value,
        macaddress: macId,
      };

      

      if (!this.email) {
        this.toast.onFail('Email is required.');
        return;
      }
  
      this.authService.onSignup(registerData, macId).subscribe(
        (res) => {
          this.isLoading = false;
          this.isSubmitted = false;
          if (res?.status?.toLowerCase() === 'success' && res?.statusCode == 200) {
            this.pwdCompleted = true;
            this.toast
              .okSuccess(res.data?.status, `${res.data?.message}. Press okay to login screen`)
              .then((res) => {
                if (res === 'ok') {
                  this.router.navigate(['/auth/login']);
                }
              });
            this.pwdForm.reset();
          } else {
            // Handle specific registration errors
            if (res?.message) {
              this.toast.onFail(res.message);
            } else {
              this.toast.onFail('Failed to register. Please try again.');
            }
          }
        },
        (err) => {
          // Log the error response or error object
          if (err?.error?.message) {
            this.toast.onFail(err.error.message);
          } else {
            this.toast.onFail('Failed to register. Please try again.');
          }
          this.isLoading = false;
          this.isSubmitted = false;
        }
      );
    } else {
      // Form is invalid, display specific error messages
      for (const controlName in this.pwdForm.controls) {
        if (this.pwdForm.controls.hasOwnProperty(controlName)) {
          const control = this.pwdForm.controls[controlName];
          control.markAsTouched(); // Mark the control as touched to trigger validation error messages
        }
      }
      this.toast.onFail('Please fix the errors in the form');
    }
  }
  
  
  getPwdErrorMsg() {
    if (this.f.password.hasError('required')) {
      return 'Password is required';
    }
    if (this.f.password.hasError('pattern')) {
      this.hasNumber = /\d/.test(this.f.password.value);
      this.hasUpper = /[A-Z]/.test(this.f.password.value);
      this.hasLower = /[a-z]/.test(this.f.password.value);
      this.hasSpecialCharacter = /[\!\@\#\$\%\^\&\*\(\)\?\>\<\:\;\"\']/.test(this.f.password.value);
      this.hasMinCharacter = this.f.password.errors?.minlength ? false : true;
      return 'Weak Password';
    }
    if (this.f.password.hasError('minlength')) {
      return 'Password must be at least 8 characters';
    }
    return '';
  }
  
  getConfirmPwdErrorMsg() {
    if (this.f.confirmPassword.hasError('required')) {
      return 'Confirm Password is required';
    }
    return this.f.confirmPassword.hasError('mustMatch') ? '' : 'Passwords must match';
  }
}
