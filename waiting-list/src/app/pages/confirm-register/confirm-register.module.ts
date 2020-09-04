import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmRegisterPageRoutingModule } from './confirm-register-routing.module';

import { ConfirmRegisterPage } from './confirm-register.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmRegisterPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ConfirmRegisterPage]
})
export class ConfirmRegisterPageModule {}
