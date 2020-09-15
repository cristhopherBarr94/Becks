import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrincipalPagePage } from './principal-page.page';

const routes: Routes = [
  {
    path: '',
    component: PrincipalPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrincipalPagePageRoutingModule {}
