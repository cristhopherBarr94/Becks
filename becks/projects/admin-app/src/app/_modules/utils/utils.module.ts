import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './_components/loading/loading.component';
import { FooterComponent } from './_components/footer/footer.component';
import { IonicModule } from '@ionic/angular';
import { SidebarComponent } from './_components/sidebar/sidebar.component';
import { ToolbarComponent } from './_components/toolbar/toolbar.component';
import { NotifyModalComponent } from './_components/notify-modal/notify-modal.component';
import { CaptchaComponent } from './_components/captcha/captcha.component';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    LoadingComponent,
    FooterComponent,
    SidebarComponent,
    ToolbarComponent,
    NotifyModalComponent,
    CaptchaComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,

  ],
  exports:[
    FooterComponent,
    SidebarComponent,
    ToolbarComponent,
    NotifyModalComponent,
    CaptchaComponent
  ]
})
export class UtilsModule { }
