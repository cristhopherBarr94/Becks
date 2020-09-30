import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SectionEditProfileComponent } from "./_components/section-edit-profile/section-edit-profile.component";
import { ProfilePage } from "./_pages/profile/profile.page";

const routes: Routes = [
  {
    path: "",
    component: ProfilePage,
  },
  {
    path: "edit",
    component: SectionEditProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
