import { NgModule } from '@angular/core';

import { FooterComponent } from './footer/footer.component';

import { IsAlphabeticalDirective } from '../directives/is-alphabetical.directive';
import { IsNumericDirective } from '../directives/is-numeric.directive';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    IsNumericDirective,
    IsAlphabeticalDirective,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    FooterComponent,
  ]
})
export class ComponentsModule { }
