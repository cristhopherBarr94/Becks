import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SectionChangePassComponent } from "./_components/section-change-pass/section-change-pass.component";
import { SectionForgetPassComponent } from "./_components/section-forget-pass/section-forget-pass.component";
import { SectionRequestConfirmComponent } from "./_components/section-request-confirm/section-request-confirm.component";
import { ActivationPage } from "./_pages/activation/activation.page";
import { ProfilePage } from "./_pages/profile/profile.page";

const routes: Routes = [
  { path: "recovery", component: SectionForgetPassComponent },
  {
    path: "",
    component: ProfilePage,
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
