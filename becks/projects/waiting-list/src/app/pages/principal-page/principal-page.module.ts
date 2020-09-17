import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CaptchaComponent } from '../../components/captcha/captcha.component';
import { SectionPrincipalFormComponent } from '../../components/section-principal-form/section-principal-form.component';
import { SectionPrincipalImgComponent } from '../../components/section-principal-img/section-principal-img.component';
import { SectionPrincipalStepComponent } from '../../components/section-principal-step/section-principal-step.component';

import { PrincipalPagePageRoutingModule } from './principal-page-routing.module';
import { PrincipalPagePage } from './principal-page.page';
import { ComponentsModule } from '../../components/components.module';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { LoadingComponent } from 'src/app/components/loading/loading.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrincipalPagePageRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    ComponentsModule
  ],
  declarations: [
    LoadingComponent,
    CaptchaComponent,
    SectionPrincipalFormComponent,
    SectionPrincipalImgComponent,
    SectionPrincipalStepComponent,
    PrincipalPagePage
  ]
})
export class PrincipalPagePageModule {}
