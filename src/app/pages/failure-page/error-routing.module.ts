import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorFourPage } from './404/404.component';
import { ErrorFivePage } from './504/504.component';



const routes: Routes = [
  {
    path: '',
    component: ErrorFourPage
  },
  {
    path: '404',
    component: ErrorFourPage
  },
  {
    path: '504',
    component: ErrorFivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorComponentRoutingModule { }
