import { Component, OnInit, Input, AfterViewInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { HttpService } from "../../../../../../_services/http.service";
import { Router } from "@angular/router";
import { User } from "../../../../../../_models/User";
import { SHA256, SHA512 } from "crypto-js";
import { UiService } from "../../../../../../_services/ui.service";

declare global {
  interface Window {
    dataLayer: any[];
  }
}
@Component({
  selector: "user-section-forget-pass",
  templateUrl: "./section-forget-pass.component.html",
  styleUrls: ["./section-forget-pass.component.scss"],
})
export class SectionForgetPassComponent implements OnInit, AfterViewInit {
  public userRegisterForm: FormGroup;
  public userRegister: User = new User();
  public captchaStatus: boolean;
  public restartCaptcha: boolean;
  public httpError: string;
  @Input() principalContent;

  constructor(
    private formBuilder: FormBuilder,
    public httpService: HttpService,
    private router: Router,
    private ui: UiService
  ) {}

  ngOnInit(): void {
    this.initforms();
  }

  ngAfterViewInit(): void {
    try {
      document
        .getElementById("mat-checkbox-promo")
        .getElementsByTagName("input")[0]
        .setAttribute("data-qadp", "input-marketing");
    } catch (error) {}
  }

  initforms() {
    this.userRegisterForm = this.formBuilder.group({
      email: new FormControl("", [
        Validators.required,
        Validators.email,
        Validators.maxLength(30),
      ]),
    });
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

  public getClassInputSelect(item: any): string {
    let classreturn = "select-becks";
    if (item.valid) {
      classreturn = "select-becks-ok";
    } else if (item.touched) {
      classreturn = "select-becks-error";
    }
    return classreturn;
  }

  public getMessageform(
    item: any,
    name: string,
    min?: number,
    max?: number
  ): string {
    if (item.hasError("required")) {
      return "Este campo es obligatorio";
    } else if (
      item.hasError("email") ||
      (item.hasError("pattern") && name === "email")
    ) {
      return "Ingrese una dirección de correo electrónico válida";
    } else if (item.hasError("pattern")) {
      return "Ingrese solo letras";
    }
  }

  public setCaptchaStatus(status) {
    this.captchaStatus = status;
  }
}
