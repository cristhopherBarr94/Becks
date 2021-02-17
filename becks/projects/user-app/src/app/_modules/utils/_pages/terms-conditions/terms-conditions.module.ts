import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TermsConditionsPageRoutingModule } from "./terms-conditions-routing.module";
import { TermsConditionsPage } from "./terms-conditions.page";
import { UtilsModule } from "../../utils.module";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTabsModule } from "@angular/material/tabs";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermsConditionsPageRoutingModule,
    UtilsModule,
    MatExpansionModule,
    MatTabsModule,
  ],
  declarations: [TermsConditionsPage],
})
export class TermsConditionsPageModule {}
