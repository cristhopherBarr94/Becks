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



@NgModule({
  entryComponents:[
  ],
  declarations: [
    PrincipalHeaderComponent,
    FooterComponent,
    SectionPrincipalFormComponent,
    SectionPrincipalImgComponent,
    SectionPrincipalStepComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule
  ],
  exports: [
    PrincipalHeaderComponent,
    FooterComponent,
    SectionPrincipalFormComponent,
    SectionPrincipalImgComponent,
    SectionPrincipalStepComponent
  ]
})
export class ComponentsModule { }
