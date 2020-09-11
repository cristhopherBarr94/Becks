import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PrincipalHeaderComponent } from './principal-header/principal-header.component';
import { FooterComponent } from './footer/footer.component';
import { SectionPrincipalFormComponent } from './section-principal-form/section-principal-form.component';
import { SectionPrincipalImgComponent } from './section-principal-img/section-principal-img.component';
import { SectionPrincipalStepComponent } from './section-principal-step/section-principal-step.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IsAlphabeticalDirective } from '../directives/is-alphabetical.directive';
import { IsNumericDirective } from '../directives/is-numeric.directive';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AgeGateComponent } from './age-gate/age-gate.component';
import { CaptchaComponent } from './captcha/captcha.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  entryComponents:[
  ],
  declarations: [
    PrincipalHeaderComponent,
    FooterComponent,
    SectionPrincipalFormComponent,
    SectionPrincipalImgComponent,
    SectionPrincipalStepComponent,
    AgeGateComponent,
    CaptchaComponent,
    IsNumericDirective,
    IsAlphabeticalDirective],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule
  ],
  exports: [
    PrincipalHeaderComponent,
    FooterComponent,
    SectionPrincipalFormComponent,
    SectionPrincipalImgComponent,
    SectionPrincipalStepComponent,
    AgeGateComponent,
    CaptchaComponent
  ]
})
export class ComponentsModule { }
