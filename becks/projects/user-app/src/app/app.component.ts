import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router } from '@angular/router';
import { AuthService } from './_services/auth.service';
import { UiService } from './_services/ui.service';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  showSplash = true;
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private router: Router,
    private authSvc: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });
    this.showSplash = !this.authSvc.isAuthenticated();
    setTimeout(() => {
      this.showSplash = false;
      if ( location.pathname == '' || location.pathname == 'app' || 
            location.pathname == '/app' || location.pathname == '/app/' ||
            location.pathname == '/' || location.pathname == '\\' ) {
        this.router.navigate(['age-gate'], { queryParamsHandling: "preserve" });
      }
    }, 2500);
  }
}
