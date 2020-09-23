import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { UtilsModule } from "../utils/utils.module";
import { HomePage } from "./_pages/home/home.page";
import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [HomePage],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    UtilsModule,
  ],
})
export class HomeModule {}
