import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmRegisterPage } from './confirm-register.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmRegisterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmRegisterPageRoutingModule {}
