import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import * as moment from "moment";
import { Router } from "@angular/router";
import { IonSlides } from "@ionic/angular";
import {
  MatCarouselSlide,
  MatCarouselSlideComponent,
} from "@ngmodule/material-carousel";
import { invalid } from "@angular/compiler/src/render3/view/util";

@Component({
  selector: "age-gate-v2",
  templateUrl: "./age-gate-v2.component.html",
  styleUrls: ["./age-gate-v2.component.scss"],
})
export class AgeGateV2Component implements OnInit {
  public yearForm: FormGroup;
  public monthForm: FormGroup;
  public dayForm: FormGroup;
  public cheked: boolean;
  public invMth: boolean;
  public invDy: boolean;

  @ViewChild("slides", { static: true }) slides: IonSlides;
  myOptions: any = {
    allowSlideNext: false,
    allowSlidePrev: false,
    allowTouchMove: false,
  };
  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.cheked = false;
    this.initforms();
    console.log(
      this.yearForm.controls.year_1.value +
        this.yearForm.controls.year_2.value +
        this.yearForm.controls.year_3.value +
        this.yearForm.controls.year_4.value
    );
  }

  initforms() {
    this.yearForm = this.formBuilder.group({
      year_1: new FormControl("", [
        Validators.required,
        Validators.min(1),
        Validators.max(2),
      ]),
      year_2: new FormControl("", [
        Validators.required,
        Validators.min(0),
        Validators.max(9),
      ]),
      year_3: new FormControl("", [
        Validators.required,
        Validators.min(0),
        Validators.max(9),
      ]),
      year_4: new FormControl("", [
        Validators.required,
        Validators.min(0),
        Validators.max(9),
      ]),
    });
    this.monthForm = this.formBuilder.group({
      month_1: new FormControl("", [
        Validators.required,
        Validators.min(0),
        Validators.max(1),
      ]),
      month_2: new FormControl("", [
        Validators.required,
        Validators.min(1),
        Validators.max(9),
      ]),
    });

    this.dayForm = this.formBuilder.group({
      day_1: new FormControl("", [
        Validators.required,
        Validators.min(0),
        Validators.max(3),
      ]),
      day_2: new FormControl("", [
        Validators.required,
        Validators.min(0),
        Validators.max(9),
      ]),
    });
  }

  validateAgeGate() {
    if (
      moment().diff(
        moment()
          .day(
            this.dayForm.controls.day_1.value +
              this.dayForm.controls.day_2.value
          )
          .month(
            this.monthForm.controls.month_1.value +
              this.monthForm.controls.month_2.value
          )
          .year(
            this.yearForm.controls.year_1.value +
              this.yearForm.controls.year_2.value +
              this.yearForm.controls.year_3.value +
              this.yearForm.controls.year_4.value
          ),
        "years"
      ) >= 18
    ) {
      if (this.cheked) {
        localStorage.setItem("user-age-gate-local", moment().toISOString());
      } else {
        sessionStorage.setItem("user-age-gate-session", moment().toISOString());
      }
      this.router.navigate(["home"], { queryParamsHandling: "preserve" });
    } else {
      localStorage.removeItem("user-age-gate-local");
      sessionStorage.removeItem("user-age-gate-session");
      window.location.href = "https://www.tapintoyourbeer.com/age_check.cfm";
    }
  }

  public inputValidatorNumeric(event: any) {
    const pattern = /^[0-9]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9]/g, "");
    }
  }

  public getClassInput(item: any): string {
    let classreturn = "input-becks";
    if (item.valid) {
      classreturn = "input-becks-ok";
      this.invMth = false;
      this.invDy = false;
    } else if (item.touched) {
      this.invMth = true;
      this.invDy = true;
      classreturn = "input-becks-error";
    }
    return classreturn;
  }
  invalidYear() {
    this.yearForm.reset();
    this.yearForm.markAllAsTouched();
  }
  invalidMonth() {
    this.monthForm.reset();
    this.monthForm.markAllAsTouched();
  }
  invalidDay() {
    this.dayForm.reset();
    this.dayForm.markAllAsTouched();
  }
  move(fromtxt, totxt) {
    var length = fromtxt.length;
    var maxlength = fromtxt.getAttribute(maxlength);
    if (length == maxlength) {
      totxt.focus();
    }
  }
}
