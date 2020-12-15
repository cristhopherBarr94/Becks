import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { UtilsModule } from "../utils/utils.module";
import { AgeGateV2Page } from "./_pages/age-gate-v2/age-gate-v2.page";
import { AgeGateV2PageRoutingModule } from "./age-gate-v2-routing.module";
import { AgeGateV2Component } from "./_components/age-gate-v2/age-gate-v2.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatCarouselModule } from "@ngmodule/material-carousel";
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [AgeGateV2Page, AgeGateV2Component],
  imports: [
    CommonModule,
    IonicModule,
    AgeGateV2PageRoutingModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatInputModule,
    UtilsModule,
    MatTabsModule,
    MatCarouselModule.forRoot(),
  ],
})
export class AgeGateV2Module {}
