import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  constructor() {
    // this.initializeApp();
  }

  // initializeApp() {
    // this.platform.ready().then(() => {
    //   this.statusBar.styleDefault();
    //   this.splashScreen.hide();
    // });
  // }

  ngOnInit() {
    this.validateCookies();
  }

  validateCookies(){
    if (localStorage.getItem('ok-cookies')){
      return true;
    } else {
      return false;
    }
  }

  okCookies(){
    localStorage.setItem('ok-cookies', moment().toISOString());
  }
}
