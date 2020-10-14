import { Component, OnInit } from '@angular/core';
import { AnimationOptions } from "ngx-lottie";

@Component({
  selector: 'user-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
})
export class SplashScreenComponent implements OnInit {
  options: AnimationOptions = {
    path: "../../../../../assets/animations/logo_script.json",
  };

  constructor() { }

  ngOnInit() {
   
  }

  styles: Partial<CSSStyleDeclaration> = {
    backgroundColor: "#000",
  };

}
