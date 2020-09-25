import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SectionForgetPassComponent } from "./_components/section-forget-pass/section-forget-pass.component";

const routes: Routes = [{ path: "", component: SectionForgetPassComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
