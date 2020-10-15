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
    private ui: UiService,
    private cdr: ChangeDetectorRef,
    private utils: UtilService
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
      typeId: new FormControl(null, Validators.required),
      privacy: new FormControl(null, Validators.required),
      promo: new FormControl(null),
    });
  }

  methodFB(userInfo: any) {
    this.userRegisterForm.controls.name.patchValue(userInfo.first_name);
    this.userRegisterForm.controls.surname.patchValue(userInfo.last_name);
    this.userRegisterForm.controls.email.patchValue(userInfo.email);
    this.cdr.detectChanges();
  }

  saveUser(): void {
    this.ui.showLoading();
    this.restartCaptcha = true;
    this.setCaptchaStatus(!this.restartCaptcha);
    this.userRegister.captcha_key = this.utils.getCaptchaKey();
    this.userRegister.captcha = this.utils.getCaptchaHash(
      this.userRegister.email,
      this.userRegister.captcha_key
    );
    const email256 = this.utils.getSHA256(this.userRegister.email);
    this.userRegister.cookie_td = this.utils.getCookie("_td");
    this.httpService
      .post(
        environment.serverUrl + environment.guest.postForm,
        this.userRegister.toJSON()
      )
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
          this.moveSection();
          this.router.navigate(["confirm-register"], {
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
