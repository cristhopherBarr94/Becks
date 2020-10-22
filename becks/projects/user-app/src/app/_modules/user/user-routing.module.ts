import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { InteractionConfirmComponent } from './_components/interaction-confirm/interaction-confirm.component';
import { InteractionViewComponent } from './_components/interaction-view/interaction-view.component';
import { ScheduleComponent } from './_components/schedule/schedule.component';
import { VerticalCalendarComponent } from './_components/vertical-calendar/vertical-calendar.component';
import { SectionChangePassComponent } from "./_modules/profile/_components/section-change-pass/section-change-pass.component";
import { ActivationPage } from "./_modules/profile/_pages/activation/activation.page";
import { MGMPage } from "./_modules/profile/_pages/mgm/mgm.page";

const routes: Routes = [

  {
    path: "profile",
    loadChildren: () =>
      import("./_modules/profile/profile.module").then((m) => m.ProfileModule),
  },
  {
    path: "exp/:id",
    loadChildren: () =>
      import("./_modules/exp/exp.module").then((m) => m.ExpModule),
  },
  {
    path: "exp",
    loadChildren: () =>
      import("./_modules/exp/exp.module").then((m) => m.ExpModule),
  },
  {
    path: "calendar",
    component: ScheduleComponent
  },
  {
    path: "confirm-interaction/:id",
    component: InteractionConfirmComponent
  },
  {
    path: "interaction/:id",
    component: InteractionViewComponent
  },
  {
    path: "calendarmob",
    component: VerticalCalendarComponent
  },
  {
    path: "changePass",
    component: SectionChangePassComponent,
  },
  {
    path: "activation",
    component: ActivationPage,
  },
  {
    path: "mgm",
    component: MGMPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
