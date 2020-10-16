import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router } from '@angular/router';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  showSplash=true

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });
    setTimeout(() => {
      this.showSplash = !this.showSplash;
      if ( location.pathname == '' || location.pathname == 'app' || location.pathname == '/app' || 
            location.pathname == '/' || location.pathname == '\\' ) {
        this.router.navigate(['age-gate']);
      }
    }, 2500);
  }
}
