import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExperiencesPageRoutingModule } from './experiences-routing.module';
import { ExperiencesPage } from './_modules/_pages/experiences.page';
import { MatTabsModule } from "@angular/material/tabs";
import { SeccionsProfileComponent } from './_components/seccions-profile/seccions-profile.component';
import { UtilsModule } from 'src/app/_modules/utils/utils.module';
import {MatGridListModule} from '@angular/material/grid-list';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExperiencesPageRoutingModule,
    MatTabsModule,
    UtilsModule,
    MatGridListModule,
  ],
  declarations: [ExperiencesPage,SeccionsProfileComponent]
})
export class ExperiencesPageModule {}
