import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { UtilsModule } from "../utils/utils.module";
import { HomePage } from "./_pages/home/home.page";
import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { MatTabsModule } from "@angular/material/tabs";
import { TabsComponent } from "./_components/tabs/tabs.component";

@NgModule({
  declarations: [HomePage, TabsComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    UtilsModule,
    MatTabsModule,
  ],
})
export class HomeModule {}
