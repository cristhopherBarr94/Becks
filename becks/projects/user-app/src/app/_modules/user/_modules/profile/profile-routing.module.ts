import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SectionForgetPassComponent } from "./_components/section-forget-pass/section-forget-pass.component";
import { ProfilePage } from "./_pages/profile/profile.page";

const routes: Routes = [
  { path: "", component: SectionForgetPassComponent },
  {
    path: "profile",
    component: ProfilePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
