import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoadingComponent } from "./_components/loading/loading.component";
import { FooterComponent } from "./_components/footer/footer.component";
import { IonicModule } from "@ionic/angular";
import { SidebarComponent } from "./_components/sidebar/sidebar.component";
import { ToolbarComponent } from "./_components/toolbar/toolbar.component";
import { NotifyModalComponent } from "./_components/notify-modal/notify-modal.component";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatIconModule } from "@angular/material/icon";
import { HeaderComponent } from "./_components/header/header.component";
import { RouterModule } from "@angular/router";
import { CaptchaComponent } from "./_components/captcha/captcha.component";
import { LottieModule } from "ngx-lottie";
import player from "lottie-web";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MenuComponent } from './_components/menu/menu.component';
import { SplashScreenComponent } from './_components/splash-screen/splash-screen.component';
import { SectionForgetPassComponent } from './_components/section-forget-pass/section-forget-pass.component';
import { NameTittleComponent } from '../user/_modules/profile/_components/name-tittle/name-tittle.component';
import { BasicAlertComponent } from './_components/basic-alert/basic-alert.component';


export function playerFactory() {
  return player;
}
@NgModule({
  declarations: [
    LoadingComponent,
    FooterComponent,
    SidebarComponent,
    ToolbarComponent,
    NotifyModalComponent,
    CaptchaComponent,
    HeaderComponent,
    MenuComponent,
    SplashScreenComponent,
    SectionForgetPassComponent,
    NameTittleComponent,
    BasicAlertComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    LottieModule.forRoot({ player: playerFactory }),
  ],
  exports: [
    FooterComponent,
    SidebarComponent,
    ToolbarComponent,
    NotifyModalComponent,
    CaptchaComponent,
    HeaderComponent,
    MenuComponent,
    SplashScreenComponent,
    SectionForgetPassComponent,
    NameTittleComponent,
    BasicAlertComponent
  ],
})
export class UtilsModule {}
