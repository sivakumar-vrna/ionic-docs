import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ForgotPwdPage } from './forgot-pwd/forgot-pwd.page';
import { LoginPage } from './login/login.page';
import { SignupPage } from './signup/signup.page';

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
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule { }