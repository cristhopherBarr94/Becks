import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'user-onboarding-page',
  templateUrl: './onboarding-page.page.html',
  styleUrls: ['./onboarding-page.page.scss'],
})
export class OnboardingPagePage implements OnInit {

  mobile = true;

  constructor() { }

  ngOnInit() {
    if (window.screen.width >= 1024) {
      this.mobile = false;
    }
  }

}
