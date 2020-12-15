import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { NotFoundPageRoutingModule } from "./not-found-routing.module";

import { NotFoundPage } from "./not-found.page";
import { UtilsModule } from "../utils/utils.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotFoundPageRoutingModule,
    UtilsModule,
  ],
  declarations: [NotFoundPage],
})
export class NotFoundPageModule {}
