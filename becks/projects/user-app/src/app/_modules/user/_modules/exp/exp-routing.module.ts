import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeExpPage } from './_pages/home-exp/home-exp.page';

const routes: Routes = [
  {
    path: "",
    component: HomeExpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpRoutingModule { }
