import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { IonicModule } from '@ionic/angular';
import { AgeGatePageRoutingModule } from './age-gate-routing.module';
import { AgeGatePage } from './age-gate.page';
import { AgeGateComponent } from 'src/app/components/age-gate/age-gate.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    AgeGatePageRoutingModule,
    MatCheckboxModule,
    MatInputModule,
    ComponentsModule
  ],
  declarations: [
    AgeGatePage,
    AgeGateComponent
  ]
})
export class AgeGatePageModule {}
