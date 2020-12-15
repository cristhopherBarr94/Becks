import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivationPageRoutingModule } from './activation-routing.module';

import { ActivationPage } from './_pages/activation/activation.page';
import { TableComponent } from './_components/table/table.component';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table'  
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule} from '@angular/material/icon';
import { UtilsModule } from 'src/app/_modules/utils/utils.module';


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
  ]
})
export class ActivationPageModule {}
