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
import { NameTittleComponent } from "./_components/name-tittle/name-tittle.component";
import { StatisticsProfileComponent } from "./_components/statistics-profile/statistics-profile.component";
import { SeccionsProfileComponent } from "./_components/seccions-profile/seccions-profile.component";
import { DayMeterComponent } from "./_components/day-meter/day-meter.component";
import { ExperiencesCardsComponent } from "./_components/experiences-cards/experiences-cards.component";
import { ExperiencesCardComponent } from "./_components/experiences-card/experiences-card.component";
import { CircleProgressComponent } from "./_components/circle-progress/circle-progress.component";
import { NgCircleProgressModule } from "ng-circle-progress";

@NgModule({
  declarations: [
    ProfilePictureComponent,
    ProfilePage,
    NameTittleComponent,
    StatisticsProfileComponent,
    SeccionsProfileComponent,
    DayMeterComponent,
    ExperiencesCardsComponent,
    ExperiencesCardComponent,
    CircleProgressComponent,
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
    MatTabsModule,
    MatCardModule,
    NgCircleProgressModule.forRoot({}),
  ],
})
export class ProfileModule {}
