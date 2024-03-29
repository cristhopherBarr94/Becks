import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import * as moment from "moment";
import { Router } from "@angular/router";
import { UiService } from "src/app/_services/ui.service";

@Component({
  selector: "app-age-gate",
  templateUrl: "./age-gate.component.html",
  styleUrls: ["./age-gate.component.scss"],
})
export class AgeGateComponent implements OnInit {
  public ageGateForm: FormGroup;
  public cheked: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private ui: UiService
  ) {}

  ngOnInit() {
    this.cheked = false;
    this.initforms();
  }

  initforms() {
    this.ageGateForm = this.formBuilder.group({
      // tslint:disable-next-line: max-line-length
      day: new FormControl("", [
        Validators.required,
        Validators.min(1),
        Validators.max(31),
      ]),
      // tslint:disable-next-line: max-line-length
      month: new FormControl("", [
        Validators.required,
        Validators.min(1),
        Validators.max(12),
      ]),
      // tslint:disable-next-line: max-line-length
      year: new FormControl("", [
        Validators.required,
        Validators.min(1920),
        Validators.max(2020),
      ]),
    });
  }

  validateAgeGate() {
    if ( this.ageGateForm.invalid ) {
      (<any>Object).values(this.ageGateForm.controls).forEach(control => {
        control.markAsTouched();
      });
    } else {
      if (  moment().diff(
              moment()
              .day(this.ageGateForm.controls.day.value)
              .month(this.ageGateForm.controls.month.value)
              .year(this.ageGateForm.controls.year.value),
              "years"
            ) >= 18 ) {
        if (this.cheked) {
          localStorage.setItem("user-age-gate-local", moment().toISOString());
        } else {
          sessionStorage.setItem("user-age-gate-session", moment().toISOString());
        }
        this.ui.showLoading();
        this.router.navigate(["home/onboarding"], { queryParamsHandling: "preserve" });
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
    } else if (item.touched) {
      classreturn = "input-becks-error";
    }
    return classreturn;
  }

  public getMessageform(
    item: any,
    name: string,
    minlength?: number,
    maxlength?: number,
    min?: number,
    max?: number
  ): string {
    if (item.hasError("required")) {
      return "Ingrese un " + name;
    } else if (item.hasError("maxlength")) {
      return "Máximo " + maxlength;
    } else if (item.hasError("minlength")) {
      return "Mínimo " + minlength;
    } else if (item.hasError("pattern")) {
      return "Ingrese solo letras";
    } else if (item.hasError("email")) {
      return "Ingrese un email válido";
    } else if (item.hasError("min") || item.hasError("max")) {
      return "Ingrese un valor entre " + min + " y " + max;
    }
  }
}
