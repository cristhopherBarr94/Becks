import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExperiencesPage } from './_modules/_pages/experiences.page';

const routes: Routes = [
  {
    path: '',
    component: ExperiencesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExperiencesPageRoutingModule {}