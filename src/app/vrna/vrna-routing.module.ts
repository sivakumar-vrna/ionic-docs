import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { VrnaPage } from './vrna.page';


const routes: Routes = [
  {
    path: '',
    component: VrnaPage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
      },
      {
        path: 'movie/:id',
        loadChildren: () => import('src/app/vrna/pages/movie-details/movie-details.module').then(m => m.MovieDetailsPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
      },
      {
        path: 'search',
        loadChildren: () => import('./pages/search/search.module').then(m => m.SearchPageModule),
      },
      {
        path: 'view-category/:category',
        loadChildren: () => import('./pages/view-category/view-category.module').then(m => m.ViewCategoryPageModule),
      },
      {
        path: 'support',
        loadChildren: () => import('./pages/support/support.module').then(m => m.SupportPageModule),
      },
      {
        path: 'my-account',
        component:MyAccountComponent
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
      },
      {
        path: 'cast-details',
        loadChildren: () => import('./pages/cast-details/cast-details.module').then(m => m.CastDetailsPageModule),
      },
      {
        path: 'filter-details',
        loadChildren: () => import('./pages/filter-details/filter-details.module').then(m => m.FilterDetailsModule),
      },
      {
        path:'movie-details',
        loadChildren:()=> import('./pages/movie-details/movie-details.module').then(m => m.MovieDetailsPageModule),
      },
      {
        path:'social-share',
        loadChildren:()=> import('./pages/social-share/social-share.module').then(m => m.SocialShareModule),
      },
      {
        path:'switch-profiles',
        loadChildren:()=> import('./pages/switch-profiles/switch-profiles.module').then(m => m.SwitchProfilesModule),
      },
      {
        path:'add-profile',
        loadChildren:()=> import('./pages/add-profile/add-profile.module').then(m => m.AddProfileModule),
      },
      {
        path:'actor-page-mobile',
        loadChildren:()=> import('./pages/actor-page/actor-page-mobile/actor-page.module').then(m => m.ActorPageMobileModule),
      },
      {
        path:'actor-page-web',
        loadChildren:()=> import('./pages/actor-page/actor-page-web/actor-page-web.module').then(m => m.ActorPageWebModule)
      },
      {
        path:'actor-page-tv',
        loadChildren:() => import('./pages/actor-page/actor-page-tv/actor-page-tv.module').then(m => m.ActorPageTvModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VrnaPageRoutingModule { }