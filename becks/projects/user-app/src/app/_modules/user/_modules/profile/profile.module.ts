import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProfileRoutingModule } from "./profile-routing.module";
import { UtilsModule } from "src/app/_modules/utils/utils.module";
import { SectionForgetPassComponent } from "./_components/section-forget-pass/section-forget-pass.component";
import { HomePage } from "./_pages/home/home.page";

import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatIconModule } from "@angular/material/icon";
@NgModule({
  declarations: [HomePage, SectionForgetPassComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    UtilsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
  ],
})
export class ProfileModule {}
