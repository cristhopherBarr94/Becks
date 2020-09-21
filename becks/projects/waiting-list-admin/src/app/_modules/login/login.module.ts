import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { UtilsModule } from '../utils/utils.module';
import { LoginPage } from './_pages/login/login.page';


@NgModule({
  declarations: [
    LoginPage
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    UtilsModule
  ]
})
export class LoginModule { }
