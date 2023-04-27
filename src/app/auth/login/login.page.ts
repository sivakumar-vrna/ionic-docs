import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from 'src/app/shared/models/auth';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AlertController, isPlatform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { StatusBarService } from 'src/app/shared/services/status-bar/status-bar.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup
  hide = true;
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authservice: AuthService,
    public toast: ToastWidget,
    private loadingController: LoadingController,
    private statusBar: StatusBarService,
    private errorService: ErrorService,
    private route: ActivatedRoute,
    public alertController: AlertController
  ) {
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

  ngOnInit() { }

  async presentAlert(token: string) {
    (await this.authservice.onUserConfirm(token)).subscribe(
      async (res) => {
        if (res?.status?.toLowerCase() === 'success' && res?.statusCode == 200) {
          console.log(res);
          const alert = await this.alertController.create({
            cssClass: 'user-confirmation',
            header: 'Welcome,',
            subHeader: 'to VRNA',
            message: 'Your registration is verified',
            buttons: ['OK']
          });

          await alert.present();

          const { role } = await alert.onDidDismiss();
          console.log('onDidDismiss resolved with role', role);
        } else {
          this.toast.onFail('User Validation failed');
        }
      }, (err) => {
        this.toast.onFail('Error in network');
      }
    )
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  async onSubmit() {
    const loading = await this.loadingController.create();
    this.isSubmitted = true;
    if (this.loginForm.valid) {
      const macId: any = this.authservice.uniqueID();
      const pwd = btoa(this.loginForm.value.password);
      console.log(pwd);
      const loginValues: Auth = {
        email: this.loginForm.value.email,
        password: pwd,
        macAddress: macId
      };
      (await this.authservice.onAuthentication(loginValues, macId)).subscribe(
        async (res) => {
          console.log(res)
          await loading.dismiss();
          if (res?.status?.toLowerCase() === 'success' && res?.statusCode == 200) {
            if (res.data) {
              const userData = res.data;
              await this.authservice.afterLogin(userData, macId, res.token);
            } else {
              this.errorService.onError(res);
            }
          } else {
            this.errorService.onError(res);
          }
          this.isSubmitted = false;
        },
        (err) => {
          this.authservice.isAuthenticated.next(false);
          this.toast.onFail('Error in network');
          this.isSubmitted = false;
          loading.dismiss();
        });
    } else {
      this.toast.onFail('Form is not valid');
      this.isSubmitted = false;
      await loading.dismiss();
    }
  }

  /* Email Error Msg's */
  getEmailErrorMsg() {
    if (this.f.email.hasError('required')) {
      return 'Email is Required';
    }
    return this.f.email.hasError('email') ? 'Valid Format is yourname@example.com' : '';
  }
}