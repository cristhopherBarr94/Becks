import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './_components/loading/loading.component';
import { FooterComponent } from './_components/footer/footer.component';
import { IonicModule } from '@ionic/angular';
import { SidebarComponent } from './_components/sidebar/sidebar.component';
import { ToolbarComponent } from './_components/toolbar/toolbar.component';


@NgModule({
  declarations: [
    LoadingComponent,
    FooterComponent,
    SidebarComponent,
    ToolbarComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[
    FooterComponent,
    SidebarComponent,
    ToolbarComponent

  ]
})
export class UtilsModule { }
