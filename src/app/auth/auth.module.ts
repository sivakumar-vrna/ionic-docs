import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { IntroPageModule } from './intro/intro.module';
import { GoogleAuthModule } from './social/google-auth/google-auth.module';
import { FbAuthModule } from './social/fb-auth/fb-auth.module';
import { LoginPage } from './login/login.page';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SignupPage } from './signup/signup.page';
import { PasswordModule } from '../components/password/password.module';
import { ForgotPwdPage } from './forgot-pwd/forgot-pwd.page';

@NgModule({
  declarations: [
    AuthComponent,
    LoginPage,
    SignupPage,
    ForgotPwdPage
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    IntroPageModule,
    GoogleAuthModule,
    FbAuthModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule,
    PasswordModule
  ]
})
export class AuthModule { }
