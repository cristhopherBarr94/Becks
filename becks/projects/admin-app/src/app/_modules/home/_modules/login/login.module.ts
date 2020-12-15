import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LoginRoutingModule } from "./login-routing.module";
import { LoginPage } from "./_pages/login/login.page";
import { MatInputModule } from "@angular/material/input";
import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatRadioModule } from "@angular/material/radio";
import { MatButtonModule } from "@angular/material/button";
import { UtilsModule } from 'src/app/_modules/utils/utils.module';

@NgModule({
  declarations: [LoginPage],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    UtilsModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
  ],
})
export class LoginModule {}
