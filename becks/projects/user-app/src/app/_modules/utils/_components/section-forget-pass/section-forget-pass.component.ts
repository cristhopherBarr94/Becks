import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { HeaderComponent } from "src/app/_modules/utils/_components/header/header.component";
import { environment } from "src/environments/environment";
import { UtilService } from "src/app/_services/util.service";
import { User } from 'src/app/_models/User';
import { HttpService } from 'src/app/_services/http.service';
import { UiService } from 'src/app/_services/ui.service';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

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
  private allowCaptchaError: boolean;
  public httpError: string;

  @ViewChild(HeaderComponent) header: HeaderComponent;
  prevUrl: string = "/home";

  constructor(
    private formBuilder: FormBuilder,
    public httpService: HttpService,
    private router: Router,
    private ui: UiService,
    private utils: UtilService,
    private userSvc: UserService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.initforms();
  }

  ngAfterViewInit(): void {
    this.header.urlComponent = this.prevUrl;
  }

  initforms() {
    this.userRegisterForm = this.formBuilder.group({
      email: new FormControl("", [
        Validators.required,
        Validators.email,
        Validators.maxLength(40),
      ]),
    });

    this.allowCaptchaError = false;
    this.userRegisterForm.valueChanges.subscribe(val => {
      this.allowCaptchaError = val.email;
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

  sendEmail(): void {
    if (this.userRegisterForm.valid) {
      this.ui.showLoading();
      this.restartCaptcha = true;
      this.setCaptchaStatus(!this.restartCaptcha);
      this.userRegister.captcha_key = this.utils.getCaptchaKey();
      this.userRegister.captcha = this.utils.getCaptchaHash(
        this.userRegister.email,
        this.userRegister.captcha_key
      );
      const email256 = this.utils.getSHA256(this.userRegister.email);
      this.httpService
        .patch(environment.serverUrl + environment.guest.patchPassword, {
          email: this.userRegister.email,
          captcha: this.userRegister.captcha,
          captcha_key: this.userRegister.captcha_key,
        })
        .subscribe(
          (data: any) => {
            try {
              this.restartCaptcha = false;
              this.ui.dismissLoading();
              this.userRegisterForm.reset();
              window.dataLayer.push({
                event: "trackEvent",
                eventCategory: "becks society",
                eventAction: "finalizar",
                eventLabel: email256,
              });
            } catch (e) {}
            this.userSvc.logout();
            this.auth.setAuthenticated(null);
            this.router.navigate(["/user/exp"], {
              queryParamsHandling: "preserve",
            });
          },
          (err) => {
            this.restartCaptcha = false;
            if (err.error) {
              this.httpError = err.error.message;
            }
            this.ui.dismissLoading();
          }
        );
    }
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
