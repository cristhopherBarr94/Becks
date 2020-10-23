import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ChangeDetectorRef,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { HttpService } from "../../../../_services/http.service";
import { Router } from "@angular/router";
import { User } from "../../../../_models/User";
import { UiService } from "../../../../_services/ui.service";
import { UtilService } from "src/app/_services/util.service";
import { environment } from 'src/environments/environment';
import { SHA256 } from "crypto-js";
import { BasicAlertComponent } from 'src/app/_modules/utils/_components/basic-alert/basic-alert.component';
import { AuthService } from 'src/app/_services/auth.service';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

@Component({
  selector: "app-user-register",
  templateUrl: "./user-register.component.html",
  styleUrls: ["./user-register.component.scss"],
})
export class UserRegisterComponent implements OnInit, AfterViewInit {
  @Input() principalContent;
  public userRegisterForm: FormGroup;
  public userRegister: User = new User();
  public captchaStatus: boolean;
  public restartCaptcha: boolean;
  public httpError: string;

  public hide: boolean;
  public hideConfirm: boolean;
  public password: string;
  public showError: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public httpService: HttpService,
    private router: Router,
    private ui: UiService,
    private cdr: ChangeDetectorRef,
    private utils: UtilService,
    private authService: AuthService
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
      name: new FormControl("", [
        Validators.required,
        Validators.maxLength(20),
      ]),
      surname: new FormControl("", [
        Validators.required,
        Validators.maxLength(20),
      ]),
      idNumber: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(11),
      ]),
      email: new FormControl("", [
        Validators.required,
        Validators.email,
        Validators.maxLength(40),
      ]),
      telephone: new FormControl("", [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(10),
      ]),
      gender: new FormControl(null, Validators.required),
      privacy: new FormControl(null, Validators.required),
      promo: new FormControl(null),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
      ]),
      password_confirm: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  methodFB(userInfo: any) {
    this.userRegisterForm.controls.name.patchValue(userInfo.first_name);
    this.userRegisterForm.controls.surname.patchValue(userInfo.last_name);
    this.userRegisterForm.controls.email.patchValue(userInfo.email);
    this.cdr.detectChanges();
  }

  saveUser(): void {

    if ( this.userRegisterForm.invalid || !this.captchaStatus ) {
      this.showError = true;
      (<any>Object).values(this.userRegisterForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.ui.showLoading();
    this.restartCaptcha = true;
    this.showError = false;
    this.setCaptchaStatus(!this.restartCaptcha);
    this.userRegister.captcha_key = this.utils.getCaptchaKey();
    this.userRegister.captcha = this.utils.getCaptchaHash(
      this.userRegister.email,
      this.userRegister.captcha_key
    );
    const email256 = SHA256(this.userRegister.email).toString();
    this.userRegister.cookie_td = this.utils.getCookie("_td");
    this.userRegister.type_id = "CC";
    this.httpService
      .post(
        environment.serverUrl + environment.guest.postForm,
        this.userRegister.toJSON()
      )
      .subscribe(
        (res: any) => {
          try {
            if ( res.status >= 200 && res.status < 300 ) {
                window.dataLayer.push({
                  event: "trackEvent",
                  eventCategory: "fase 3",
                  eventAction: "finalizar fase 3",
                  eventLabel: email256,
                });
                // window.location.reload();
                // this.ui.showModal( BasicAlertComponent, "modalMessage", false, false, {
                //   title: "Bienvenido a Beck's",
                //   description: "Ingresando de forma segura",
                // });

                const formData = new FormData();
                try {
                  this.restartCaptcha = true;
                  this.setCaptchaStatus(!this.restartCaptcha);
                  formData.append("username", this.userRegisterForm.controls.email.value.trim());
                  formData.append("password", this.userRegisterForm.controls.password.value.trim());
                  formData.append("grant_type", environment.rest.grant_type);
                  formData.append("client_id", environment.rest.client_id);
                  formData.append("client_secret", environment.rest.client_secret);
                  formData.append("scope", environment.rest.scope);
                } catch (error) {
                  return;
                }
                this.userRegisterForm.reset();
                this.httpService
                .postFormData(
                  environment.serverUrl + environment.login.resource,
                  formData
                )
                .subscribe(
                  (response: any) => {
                    this.ui.dismissLoading();
                    if ( response.status >= 200 && response.status < 300 ) {
                      this.restartCaptcha = false;
                      this.router.navigate(["user/exp"]);
                      this.ui.dismissModal(2500);
                      this.ui.dismissLoading(2500);
                      this.authService.setAuthenticated(
                        "Bearer " + response.body.access_token
                      );
                      this.router.navigate(["user/exp"], {
                        queryParamsHandling: "preserve",
                      });
                    } else {
                      location.reload();  
                    }
                  }, (e) => {
                    location.reload();
                  });
                  
            } else {
              this.showError = true;
            }
            
          } catch (e) {
            this.showError = true;
          }
        },
        (err) => {
          this.showError = true;
          this.restartCaptcha = false;
          if (err.error) {
            this.httpError = err.error.message;
          }
          this.ui.dismissLoading();
        }
      );
  }

  public moveSection() {
    const y = document.getElementById("section-img").offsetTop;
    this.principalContent.scrollToPoint(0, y);
  }

  public inputValidatorNumeric(event: any) {
    const pattern = /^[0-9]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9]/g, "");
    }
  }

  public inputValidatorAlphabetical(event: any) {
    const pattern = /^[a-zA-ZnÑ ]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-zA-ZnÑ ]/g, "");
    }
  }

  public inputValidatorAlphaNumeric(event: any) {
    const pattern = /^[a-zA-ZnÑ0-9 ]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-zA-ZnÑ0-9 ]/g, "");
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
    } else if (item.hasError("maxlength")) {
      return "Máximo " + max;
    } else if (item.hasError("minlength")) {
      return "Mínimo " + min;
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
