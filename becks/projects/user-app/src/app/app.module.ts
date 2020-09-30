import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { UtilsModule } from './_modules/utils/utils.module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuardService } from './_services/auth-guard.service';
import { AuthService } from './_services/auth.service';
import { HttpService } from './_services/http.service';
import { ExperienciasService } from './_services/experiencias.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, IonicModule.forRoot(), 
    AppRoutingModule,
    UtilsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService,
    AuthGuardService,
    HttpService,
    ExperienciasService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
