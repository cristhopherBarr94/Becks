import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SectionChangePassComponent } from "./_components/section-change-pass/section-change-pass.component";
import { SectionForgetPassComponent } from "./_components/section-forget-pass/section-forget-pass.component";
import { SectionRequestConfirmComponent } from "./_components/section-request-confirm/section-request-confirm.component";

const routes: Routes = [
  {
    path: "",
    component: SectionForgetPassComponent,
    children: [
      { path: "", pathMatch: "prefix", redirectTo: "email" },
      { path: "email", component: SectionRequestConfirmComponent },
      { path: "", pathMatch: "prefix", redirectTo: "change-pass" },
      { path: "change-pass", component: SectionChangePassComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
