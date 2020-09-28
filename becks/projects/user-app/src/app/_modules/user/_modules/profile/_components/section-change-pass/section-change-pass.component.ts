import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { UiService } from "src/app/_services/ui.service";
import { HttpService } from "src/app/_services/http.service";
import { AuthService } from "src/app/_services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "user-section-change-pass",
  templateUrl: "./section-change-pass.component.html",
  styleUrls: ["./section-change-pass.component.scss"],
})
export class SectionChangePassComponent implements OnInit {
  public userLoginForm: FormGroup;
  public httpError: string;
  public captchaStatus: boolean;
  public restartCaptcha: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private ui: UiService,
    private httpService: HttpService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initforms();
  }

  initforms() {
    this.userLoginForm = this.formBuilder.group({
      passwordVerify: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  changePass(): void {
    if (this.userLoginForm.valid) {
      this.ui.showLoading();
      const formData = new FormData();
      formData.append("password", this.userLoginForm.controls.password.value);
      formData.append(
        "passwordVerify",
        this.userLoginForm.controls.password.value
      );
      this.httpService.post("", formData).subscribe(
        (response: any) => {
          this.ui.dismissLoading();
          if (response.status == 200) {
            this.httpError = "";
            this.userLoginForm.reset();
          }
        },
        (e) => {
          this.httpError = "Contraseña incorrecta";
          this.ui.dismissLoading();
          this.router.navigate(["home"]);
        }
      );
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
    min?: number,
    max?: number
  ): string {
    if (item.hasError("password")) {
      return "Contraseña inválida";
    }
  }
  public setCaptchaStatus(status) {
    this.captchaStatus = status;
  }
}
