import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AgeGateV2Page } from "./_pages/age-gate-v2/age-gate-v2.page";

const routes: Routes = [
  {
    path: "",
    component: AgeGateV2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgeGateV2PageRoutingModule {}
