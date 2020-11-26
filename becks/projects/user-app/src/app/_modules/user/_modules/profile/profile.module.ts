import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProfileRoutingModule } from "./profile-routing.module";
import { UtilsModule } from "src/app/_modules/utils/utils.module";

import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProfilePictureComponent } from "./_components/profile-picture/profile-picture.component";
import { ProfilePage } from "./_pages/profile/profile.page";
import { StatisticsProfileComponent } from "./_components/statistics-profile/statistics-profile.component";
import { SeccionsProfileComponent } from "./_components/seccions-profile/seccions-profile.component";
import { ExperiencesCardsComponent } from "./_components/experiences-cards/experiences-cards.component";
import { ExperiencesCardComponent } from "./_components/experiences-card/experiences-card.component";
import { SalesCardsComponent } from "./_components/sales-cards/sales-cards.component";
import { SalesCardComponent } from "./_components/sales-card/sales-card.component";
import { NgCircleProgressModule } from "ng-circle-progress";
import { SectionEditProfileComponent } from "./_components/section-edit-profile/section-edit-profile.component";
import { UpdateFileComponent } from "./_components/update-file/update-file.component";
import { IonicModule } from "@ionic/angular";
import { LogOutComponent } from "./_components/log-out/log-out.component";
import { EditFormComponent } from "./_components/edit-form/edit-form.component";
import { SectionChangePassComponent } from "./_components/section-change-pass/section-change-pass.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
@NgModule({
  declarations: [
    LogOutComponent,
    ProfilePictureComponent,
    ProfilePage,
    StatisticsProfileComponent,
    SeccionsProfileComponent,
    ExperiencesCardsComponent,
    ExperiencesCardComponent,
    SalesCardsComponent,
    SalesCardComponent,
    SectionChangePassComponent,
    SectionEditProfileComponent,
    UpdateFileComponent,
    EditFormComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    IonicModule,
    UtilsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatCardModule,
    NgCircleProgressModule.forRoot({}),
  ],
})
export class ProfileModule {}
