import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrincipalPagePageRoutingModule } from './principal-page-routing.module';

import { PrincipalPagePage } from './principal-page.page';
import { ComponentsModule } from '../../components/components.module';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrincipalPagePageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  declarations: [PrincipalPagePage]
})
export class PrincipalPagePageModule {}
