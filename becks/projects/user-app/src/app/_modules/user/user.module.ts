import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserRoutingModule } from "./user-routing.module";
import { SectionForgetPassComponent } from "./_modules/profile/_components/section-forget-pass/section-forget-pass.component";
import { SectionRequestConfirmComponent } from "./_modules/profile/_components/section-request-confirm/section-request-confirm.component";
import { SectionChangePassComponent } from "./_modules/profile/_components/section-change-pass/section-change-pass.component";
import { UtilsModule } from "../utils/utils.module";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ActivationPage } from "./_modules/profile/_pages/activation/activation.page";
import { UserService } from "src/app/_services/user.service";

@NgModule({
  declarations: [
    SectionForgetPassComponent,
    SectionRequestConfirmComponent,
    SectionChangePassComponent,
    ActivationPage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    UtilsModule,
  ],
  providers: [UserService],
})
export class UserModule {}
