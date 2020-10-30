import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ExpRoutingModule } from "./exp-routing.module";
import { HomeExpPage } from "./_pages/home-exp/home-exp.page";
import { SliderExpComponent } from "./_components/slider-exp/slider-exp.component";
import { VerticalCalendarComponent } from "./_components/vertical-calendar/vertical-calendar.component";
import { UtilsModule } from "src/app/_modules/utils/utils.module";
import { ScheduleComponent } from "./_components/schedule/schedule.component";
import { MatCarouselModule } from "@ngmodule/material-carousel";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
@NgModule({
  declarations: [
    SliderExpComponent,
    HomeExpPage,
    VerticalCalendarComponent,
    ScheduleComponent,
  ],
  imports: [
    CommonModule,
    ExpRoutingModule,
    UtilsModule,
    MatCarouselModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSlideToggleModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "es-ES" }],
})
export class ExpModule {}
