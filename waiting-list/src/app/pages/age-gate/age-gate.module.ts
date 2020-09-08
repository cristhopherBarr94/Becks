import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgeGatePageRoutingModule } from './age-gate-routing.module';

import { AgeGatePage } from './age-gate.page';
import { MatInputModule } from '@angular/material/input';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgeGatePageRoutingModule,
    MatInputModule,
    ComponentsModule
  ],
  declarations: [AgeGatePage]
})
export class AgeGatePageModule {}
