import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActiveListPageRoutingModule } from './active-list-routing.module';

import { ActiveListPage } from './active-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveListPageRoutingModule
  ],
  declarations: [ActiveListPage]
})
export class ActiveListPageModule {}
