import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { UtilsModule } from "../utils/utils.module";
import { HomePage } from "./_pages/home/home.page";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatTabsModule } from "@angular/material/tabs";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { TabsComponent } from "./_components/tabs/tabs.component";

import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatIconModule } from "@angular/material/icon";
import { UserLoginComponent } from "./_components/user-login/user-login.component";
import { UserRegisterComponent } from "./_components/user-register/user-register.component";
import { FbButtonComponent } from "./_components/fb-button/fb-button.component";
import { OnboardingComponent } from './_components/onboarding/onboarding.component';
import { OnboardingPagePage } from './_pages/onboarding-page/onboarding-page.page';
import { SectionRequestConfirmComponent } from './_components/section-request-confirm/section-request-confirm.component';
import { SectionForgetPassComponent } from './_components/section-forget-pass/section-forget-pass.component';

@NgModule({
  declarations: [
    HomePage,
    UserRegisterComponent,
    TabsComponent,
    UserLoginComponent,
    FbButtonComponent,
    OnboardingComponent,
    OnboardingPagePage,
    SectionRequestConfirmComponent,
    SectionForgetPassComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    UtilsModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatTabsModule,
  ],
})
export class HomeModule {}
