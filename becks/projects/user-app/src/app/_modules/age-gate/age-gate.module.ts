import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AgeGateRoutingModule } from "./age-gate-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { UtilsModule } from "../utils/utils.module";
import { AgeGateComponent } from "./_components/age-gate/age-gate.component";
import { AgeGatePage } from "./_pages/age-gate/age-gate.page";
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [AgeGateComponent, AgeGatePage],
  imports: [
    CommonModule,
    IonicModule,
    AgeGateRoutingModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatInputModule,
    UtilsModule,
  ],
})
export class AgeGateModule {}
