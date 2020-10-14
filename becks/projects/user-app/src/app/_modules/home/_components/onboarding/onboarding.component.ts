import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'user-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {

  slideOpts = {
    speed: 400
  };

  disablePrevBtn = true;
  disableNextBtn = false;
  finalSlider: Promise<boolean>;

  @ViewChild('slides') ionSlides: IonSlides;

  constructor() { }

  ngOnInit() {}

  swipeNext(){
    this.ionSlides.slideNext();
  }

  doCheck() {
    const prom1 = this.ionSlides.isBeginning();
    const prom2 = this.ionSlides.isEnd();
    Promise.all([prom1, prom2]).then((data) => {
      data[0] ? this.disablePrevBtn = true : this.disablePrevBtn = false;
      data[1] ? this.disableNextBtn = true : this.disableNextBtn = false;
    });
  }

}
