import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LoginRoutingModule } from "./login-routing.module";
import { UtilsModule } from "../utils/utils.module";
import { LoginPage } from "./_pages/login/login.page";
import { MatInputModule } from "@angular/material/input";
import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { CaptchaComponent } from "./_components/captcha/captcha.component";
import { MatIconModule } from "@angular/material/icon";
import { MatRadioModule } from "@angular/material/radio";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [LoginPage, CaptchaComponent],
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
