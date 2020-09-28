import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProfileRoutingModule } from "./profile-routing.module";
import { UtilsModule } from "src/app/_modules/utils/utils.module";

import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SectionForgetPassComponent } from "./_components/section-forget-pass/section-forget-pass.component";
import { SectionRequestConfirmComponent } from "./_components/section-request-confirm/section-request-confirm.component";
import { SectionChangePassComponent } from "./_components/section-change-pass/section-change-pass.component";
import { ProfilePictureComponent } from "./_components/profile-picture/profile-picture.component";
import { ProfilePage } from "./_pages/profile/profile.page";
import { NameTittleComponent } from "./_components/name-tittle/name-tittle.component";

@NgModule({
  declarations: [
    SectionForgetPassComponent,
    SectionRequestConfirmComponent,
    SectionChangePassComponent,
    ProfilePictureComponent,
    ProfilePage,
    NameTittleComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    UtilsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ProfileModule {}
