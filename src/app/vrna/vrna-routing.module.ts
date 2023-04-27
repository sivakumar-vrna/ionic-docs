import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { TransactionsComponent } from './pages/transactions/transactions.component';
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
        loadChildren: () => import('./pages/movie-details/movie-details.module').then(m => m.MovieDetailsPageModule),
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VrnaPageRoutingModule { }
