import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserRoutingModule } from "./user-routing.module";
import { UtilsModule } from "../utils/utils.module";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ActivationPage } from "./_modules/profile/_pages/activation/activation.page";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MGMPage } from "./_modules/profile/_pages/mgm/mgm.page";
import { MatCarouselModule } from "@ngmodule/material-carousel";
import { MatNativeDateModule, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { VerticalCalendarComponent } from "./_components/vertical-calendar/vertical-calendar.component";
import { ScheduleComponent } from "./_components/schedule/schedule.component";
import { InteractionConfirmComponent } from "./_components/interaction-confirm/interaction-confirm.component";
import { InteractionViewComponent } from "./_components/interaction-view/interaction-view.component";
import { LOCALE_ID } from "@angular/core";
import es from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";
import { AnnouncerAccessForbiddenComponent } from "./_components/announcer-access-forbidden/announcer-access-forbidden.component";
import { AnnouncerAmountComponent } from "./_components/announcer-amount/announcer-amount.component";

registerLocaleData(es);
@NgModule({
  declarations: [
    ActivationPage,
    MGMPage,
    ScheduleComponent,
    InteractionViewComponent,
    InteractionConfirmComponent,
    VerticalCalendarComponent,
    AnnouncerAccessForbiddenComponent,
    AnnouncerAmountComponent,
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
    MatTooltipModule,
    MatCarouselModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "es-ES" },
    { provide: LOCALE_ID, useValue: "es-CO" },
  ],
})
export class UserModule {}
