import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AuthLoginGuard } from './guards/auth-login.guard';
import { IntroGuard } from './guards/intro.guard';
import { AuthModule } from './auth/auth.module';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canLoad: [IntroGuard],
    canActivate: [AuthLoginGuard]
  },
  {
    path: 'intro',
    loadChildren: () => import('./auth/intro/intro.module').then(m => m.IntroPageModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./pages/terms-conditions/terms-conditions.module').then(m => m.TermsConditionsPageModule)
  },
  {
    path: 'policy',
    loadChildren: () => import('./pages/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'error',
    loadChildren: () => import('./pages/failure-page/error-routing.module').then(m => m.ErrorComponentRoutingModule)
  },
  {
    path: '',
    loadChildren: () => import('./vrna/vrna.module').then(m => m.VrnaPageModule),
    canActivate: [AuthGuard]
  },
  { path: '**', component: AuthModule },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
