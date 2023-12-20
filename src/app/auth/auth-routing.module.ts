import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ForgotPwdPage } from './forgot-pwd/forgot-pwd.page';
import { LoginPage } from './login/login.page';
import { SignupPage } from './signup/signup.page';
import { PhoneAuthComponent } from './phone-auth/phone-auth.component';
import { CodeComponent } from './phone-auth/code/code.component';
import { PhPwdComponent } from './phone-auth/ph-pwd/ph-pwd.component';

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                component: LoginPage,
            },
            {
                path: 'signup',
                component: SignupPage,
            },
            {
                path: 'reset',
                component: ForgotPwdPage,
            },
            {
                path:'phone',
                component:PhoneAuthComponent,
            },
            {
                path:'code',
                component:CodeComponent,
            },
            {
                path:'ph-pwd',
                component:PhPwdComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule { }