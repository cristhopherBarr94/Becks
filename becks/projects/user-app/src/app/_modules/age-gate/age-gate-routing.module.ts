import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AgeGatePage } from "./_pages/age-gate/age-gate.page";

const routes: Routes = [
  {
    path: "",
    component: AgeGatePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgeGateRoutingModule {}
