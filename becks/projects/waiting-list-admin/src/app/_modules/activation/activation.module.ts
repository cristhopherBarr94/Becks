import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivationPageRoutingModule } from './activation-routing.module';

import { ActivationPage } from './activation.page';
import { UtilsModule } from '../utils/utils.module';
import { TableComponent } from './components/table/table.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { UserListService } from 'src/app/_services/UserList.service';
import { MatTableModule } from '@angular/material/table'  
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivationPageRoutingModule,
    UtilsModule,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule
    
  ],
  declarations: [
    ActivationPage,
    TableComponent
  ],
  providers: [
    UserListService
  ]
})
export class ActivationPageModule {}
