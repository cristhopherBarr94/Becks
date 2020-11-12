import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditionPage } from './_modules/_pages/edition.page';

const routes: Routes = [
  {
    path: '',
    component: EditionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditionPageRoutingModule {}
