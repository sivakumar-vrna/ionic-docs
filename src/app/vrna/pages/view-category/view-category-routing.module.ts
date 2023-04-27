import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewCategoryPage } from './view-category.page';

const routes: Routes = [
  {
    path: '',
    component: ViewCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewCategoryPageRoutingModule {}
