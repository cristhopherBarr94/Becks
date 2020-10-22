import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { UiService } from 'src/app/_services/ui.service';

@Component({
  selector: 'user-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit, AfterViewInit {

  slideOpts = {
    speed: 400
  };

  disablePrevBtn = true;
  disableNextBtn = false;
  finalSlider: Promise<boolean>;

  @ViewChild('slides') ionSlides: IonSlides;

  constructor(private ui: UiService, private router: Router,) { }

  ngOnInit() { }
  
  ngAfterViewInit() {
    this.ui.dismissLoading(2500);
  }
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

  joinredirection(){
    this.ui.showLoading();
      this.router.navigate(["home"], { queryParamsHandling: "preserve" });
  }

}
