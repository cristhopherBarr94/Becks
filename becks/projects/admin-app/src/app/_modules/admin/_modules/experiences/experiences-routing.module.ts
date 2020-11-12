import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditFormComponent } from './_components/edit-form/edit-form.component';

import { ExperiencesPage } from './_pages/experiences.page';

const routes: Routes = [
  {
    path: '',
    component: ExperiencesPage
  },
  {
    path: 'edit',
    component: EditFormComponent

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExperiencesPageRoutingModule {}
