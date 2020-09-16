import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActiveListPage } from './active-list.page';

const routes: Routes = [
  {
    path: '',
    component: ActiveListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActiveListPageRoutingModule {}
