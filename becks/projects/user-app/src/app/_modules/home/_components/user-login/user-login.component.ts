import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { UiService } from "src/app/_services/ui.service";
import { environment } from "src/environments/environment";
import { HttpService } from "src/app/_services/http.service";
import { AuthService } from "src/app/_services/auth.service";
import { UserService } from "src/app/_services/user.service";

@Component({
  selector: "user-user-login",
  templateUrl: "./user-login.component.html",
  styleUrls: ["./user-login.component.scss"],
})
export class UserLoginComponent implements OnInit {
  public userLoginForm: FormGroup;
  public httpError: string;
  public captchaStatus: boolean;
  public restartCaptcha: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private ui: UiService,
    private httpService: HttpService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initforms();
    this.redirect();
  }

  redirect() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(["user/profile"], {
        queryParamsHandling: "preserve",
      });
    }
  }

  initforms() {
    this.userLoginForm = this.formBuilder.group({
      email: new FormControl("", [
        Validators.required,
        Validators.email,
        Validators.maxLength(30),
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  loginUser(): void {
    if (this.userLoginForm.valid && this.captchaStatus) {
      this.ui.showLoading();
      this.restartCaptcha = true;
      this.setCaptchaStatus(!this.restartCaptcha);
      const formData = new FormData();
      formData.append("username", this.userLoginForm.controls.email.value);
      formData.append("password", this.userLoginForm.controls.password.value);
      formData.append("grant_type", environment.rest.grant_type);
      formData.append("client_id", environment.rest.client_id);
      formData.append("client_secret", environment.rest.client_secret);
      formData.append("scope", environment.rest.scope);
      this.httpService
        .postFormData(
          environment.serverUrl + environment.login.resource,
          formData
        )
        .subscribe(
          (response: any) => {
            this.ui.dismissLoading();
            if (response.status == 200) {
              this.httpError = "";
              this.userLoginForm.reset();
              this.authService.setAuthenticated(
                "Bearer " + response.body.access_token
              );
            }
            this.redirect();
          },
          (e) => {
            this.httpError = "Usuario y/o contraseña incorrecta";
            this.ui.dismissLoading();
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
    if (item.hasError("email") && name === "email") {
      return "Ingrese una dirección de correo electrónico válida";
    }
    if (item.hasError("password")) {
      return "Contraseña inválida";
    }
  }
  public setCaptchaStatus(status) {
    this.captchaStatus = status;
  }
}
