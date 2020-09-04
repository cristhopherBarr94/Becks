import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PrincipalHeaderComponent } from './principal-header/principal-header.component';
import { FooterComponent } from './footer/footer.component';



@NgModule({
  entryComponents:[
  ],
  declarations: [
    PrincipalHeaderComponent,
    FooterComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    PrincipalHeaderComponent,
    FooterComponent
  ]
})
export class ComponentsModule { }
