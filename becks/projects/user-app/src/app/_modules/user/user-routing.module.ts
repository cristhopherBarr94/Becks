import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "src/app/_services/auth-guard.service";
import { SectionChangePassComponent } from "./_modules/profile/_components/section-change-pass/section-change-pass.component";
import { SectionForgetPassComponent } from "./_modules/profile/_components/section-forget-pass/section-forget-pass.component";
import { SectionRequestConfirmComponent } from "./_modules/profile/_components/section-request-confirm/section-request-confirm.component";
import { ActivationPage } from "./_modules/profile/_pages/activation/activation.page";
import { MGMPage } from "./_modules/profile/_pages/mgm/mgm.page";

const routes: Routes = [
  { path: "recovery", component: SectionForgetPassComponent },
  {
    path: "profile",
    loadChildren: () =>
      import("./_modules/profile/profile.module").then((m) => m.ProfileModule),
  },
  {
    path: "exp",
    loadChildren: () =>
      import("./_modules/exp/exp.module").then((m) => m.ExpModule),
  },
  {
    path: "email",
    component: SectionRequestConfirmComponent,
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
