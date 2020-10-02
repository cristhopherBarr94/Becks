import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpRoutingModule } from './exp-routing.module';
import { HomeExpPage } from './_pages/home-exp/home-exp.page';
import { SliderExpComponent } from './_components/slider-exp/slider-exp.component';


@NgModule({
  declarations: [
    SliderExpComponent,
    HomeExpPage
  ],
  imports: [
    CommonModule,
    ExpRoutingModule
  ]
})
export class ExpModule { }
