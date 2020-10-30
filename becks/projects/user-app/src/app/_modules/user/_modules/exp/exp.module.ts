import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ExpRoutingModule } from "./exp-routing.module";
import { HomeExpPage } from "./_pages/home-exp/home-exp.page";
import { SliderExpComponent } from "./_components/slider-exp/slider-exp.component";
import { UtilsModule } from "src/app/_modules/utils/utils.module";
import { MatCarouselModule } from "@ngmodule/material-carousel";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, MAT_DATE_LOCALE } from "@angular/material/core";
import { IonicModule } from '@ionic/angular';
import { MatIconModule } from '@angular/material/icon';
import { AnnouncerDaysComponent } from '../../_components/announcer-days/announcer-days.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AnnouncerAmountComponent } from '../../_components/announcer-amount/announcer-amount.component';
import { SoldMessageComponent } from '../../_components/sold-message/sold-message.component';
@NgModule({
  declarations: [
    SliderExpComponent,
    HomeExpPage,
    AnnouncerDaysComponent,
    AnnouncerAmountComponent,
    SoldMessageComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ExpRoutingModule,
    UtilsModule,
    MatCarouselModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatIconModule,
    NgCircleProgressModule.forRoot({}),
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "es-ES" }],
})
export class ExpModule {}
