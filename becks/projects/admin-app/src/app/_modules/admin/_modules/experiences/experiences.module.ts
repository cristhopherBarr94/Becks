import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExperiencesPageRoutingModule } from './experiences-routing.module';
import { ExperiencesPage } from './_modules/_pages/experiences.page';
import { MatTabsModule } from "@angular/material/tabs";
import { SeccionsProfileComponent } from './_components/seccions-profile/seccions-profile.component';
import { UtilsModule } from 'src/app/_modules/utils/utils.module';
import {MatGridListModule} from '@angular/material/grid-list';
import { CardComponent } from './_components/card/card.component';
import { EditFormComponent } from './_components/edit-form/edit-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExperiencesPageRoutingModule,
    MatTabsModule,
    UtilsModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatSlideToggleModule 
  ],
  declarations: [ExperiencesPage,SeccionsProfileComponent,CardComponent,EditFormComponent]
})
export class ExperiencesPageModule {}
