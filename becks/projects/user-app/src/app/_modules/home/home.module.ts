import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { UtilsModule } from "../utils/utils.module";
import { HomePage } from "./_pages/home/home.page";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [HomePage],
  imports: [CommonModule, HomeRoutingModule, UtilsModule, IonicModule],
})
export class HomeModule {}
