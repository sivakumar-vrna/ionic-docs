import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActorPageTvComponent } from './actor-page-tv.component';

const routes: Routes = [
  {
    path: '',
    component: ActorPageTvComponent,
    children: [
      {
        path: '',
        redirectTo: 'all-actors', 
        pathMatch: 'full'
      },
      {
        path: 'all-actors',
        loadChildren: () => import('./all-actors/all-actors.module').then(m => m.AllActorsModule),
       },
      {
        path: 'actor-page',
        loadChildren: () => import('./actor-page/actor-page.module').then(m => m.ActorPageModule),
      },
      {
        path: 'all-movies',
        loadChildren: () => import('./all-movies/all-movies.module').then(m => m.AllMoviesModule),
      },
      {
        path: 'favorite-movies',
        loadChildren: () => import('./favorite-movies/favorite-movies.module').then(m => m.FavoriteMoviesModule),
      },
      {
        path:'search-tv',
        loadChildren:() => import('./search-tv/search-tv.module').then(m =>m.SearchTvModule),
      },
      {
        path:'setting-tv',
        loadChildren:() => import('./setting-tv/setting-tv.module').then(m => m.SettingTvModule),
      },
     
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActorPageTvRoutingModule { }
