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
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "age-gate-v2",
  templateUrl: "./age-gate-v2.component.html",
  styleUrls: ["./age-gate-v2.component.scss"],
})
export class AgeGateV2Component implements OnInit {
  public yearForm: FormGroup;
  public monthForm: FormGroup;
  public dayForm: FormGroup;
  public checked: boolean;
  public invMth: boolean;
  public invDy: boolean;
  public daychk: boolean = false;
  public monthchk: boolean = false;
  public yearchk: boolean = false;
  public arrowsCtrl: boolean = true;
  public cont: number = 2;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      "chevron-left",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../../../../assets/icon/chevron-left.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "chevron-right",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../../../../assets/icon/chevron-right.svg"
      )
    );
  }

  ngOnInit() {
    this.checked = false;
    this.initforms();
    // console.log(
    //   this.yearForm.controls.year_1.value +
    //     this.yearForm.controls.year_2.value +
    //     this.yearForm.controls.year_3.value +
    //     this.yearForm.controls.year_4.value
    // );
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
      this.yearchk == false ||
      this.monthchk == false ||
      this.daychk == false
    ) {
      this.invalidYear();
      this.invalidMonth();
      this.invalidDay();
    } else {
      if (
        this.yearchk == true &&
        this.monthchk == true &&
        this.daychk == true
      ) {
        if (this.checked) {
          localStorage.setItem("user-age-gate-local", moment().toISOString());
        } else {
          sessionStorage.setItem(
            "user-age-gate-session",
            moment().toISOString()
          );
        }
        this.router.navigate(["home"], { queryParamsHandling: "preserve" });
      } else {
        localStorage.removeItem("user-age-gate-local");
        sessionStorage.removeItem("user-age-gate-session");
        window.location.href = "https://www.tapintoyourbeer.com/age_check.cfm";
      }
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
    document.getElementById("year1").focus();
  }
  invalidMonth() {
    this.monthForm.reset();
    this.monthForm.markAllAsTouched();
  }
  invalidDay() {
    this.dayForm.reset();
    this.dayForm.markAllAsTouched();
  }
  move(event, fromtxt, totxt) {
    var length = fromtxt.length;
    var maxlength = fromtxt.getAttribute(maxlength);

    if (event.key === "Backspace") {
      console.log(event.key, this.cont);
      document.getElementById("year" + this.cont).focus();
      this.cont -= 1;
      if (this.cont < 1) {
        this.cont = 1;
      }
    } else {
      this.cont = 2;
      if (length == maxlength) {
        totxt.focus();
      }
    }
  }
  validateYear(event) {
    if (event.key === "Backspace") {
      document.getElementById("year3").focus();
      this.yearchk = false;
      this.arrowsCtrl = true;
    } else {
      if (
        this.yearForm.controls.year_1.value +
          this.yearForm.controls.year_2.value +
          this.yearForm.controls.year_3.value +
          this.yearForm.controls.year_4.value >=
          1920 &&
        this.yearForm.controls.year_1.value +
          this.yearForm.controls.year_2.value +
          this.yearForm.controls.year_3.value +
          this.yearForm.controls.year_4.value <=
          parseInt((new Date().getFullYear() - 18).toString())
      ) {
        if (
          this.yearForm.controls.year_1.value +
            this.yearForm.controls.year_2.value +
            this.yearForm.controls.year_3.value +
            this.yearForm.controls.year_4.value ==
          2002
        ) {
          console.log("ingrese mes");
          this.arrowsCtrl = false;
          this.yearchk = false;
        } else {
          this.yearchk = true;
          this.monthchk = true;
          this.daychk = true;
          console.log("es mayor de edad año");
        }
      } else {
        console.log("menor de edad año");
        window.location.href = "https://www.tapintoyourbeer.com/age_check.cfm";
      }
    }
  }

  validateMonth(event) {
    if (event.key === "Backspace") {
      document.getElementById("month1").focus();
      this.monthchk = false;
    } else {
      if (
        this.monthForm.controls.month_1.value +
          this.monthForm.controls.month_2.value <=
        new Date().getMonth()
      ) {
        console.log("es mayor de edad mes");
        this.yearchk = true;
        this.monthchk = true;
        this.daychk = true;
      } else {
        console.log("ingrese día");
        this.monthchk = false;
      }
    }
  }

  validateDay(event) {
    if (event.key === "Backspace") {
      document.getElementById("day1").focus();
      this.daychk = false;
    } else {
      if (
        this.dayForm.controls.day_1.value + this.dayForm.controls.day_2.value <=
        new Date().getDate()
      ) {
        console.log("es mayor de edad día");
        this.yearchk = true;
        this.monthchk = true;
        this.daychk = true;
      } else {
        console.log("menor de edad día", new Date().getDate());
        this.daychk = false;
        window.location.href = "https://www.tapintoyourbeer.com/age_check.cfm";
      }
    }
  }
}
