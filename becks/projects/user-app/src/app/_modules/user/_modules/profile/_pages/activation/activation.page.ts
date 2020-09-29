import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { HttpService } from "../../../../../../_services/http.service";
import { Router } from "@angular/router";
import { User } from "../../../../../../_models/User";
import { UiService } from "../../../../../../_services/ui.service";
import { HeaderComponent } from "src/app/_modules/utils/_components/header/header.component";

declare global {
  interface Window {
    dataLayer: any[];
  }
}
@Component({
  selector: "user-activation",
  templateUrl: "./activation.page.html",
  styleUrls: ["./activation.page.scss"],
})
export class ActivationPage implements OnInit, AfterViewInit {
  public userActivationForm: FormGroup;
  public userActivation: User = new User();
  public captchaStatus: boolean;
  public restartCaptcha: boolean;
  public httpError: string;

  @ViewChild(HeaderComponent) header: HeaderComponent;
  title: string = "activa tu cuenta";
  prevUrl: string = "/home";

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
    this.header.title = this.title;
    this.header.urlComponent = this.prevUrl;
  }

  initforms() {
    this.userActivationForm = this.formBuilder.group({
      codeNum: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(11),
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
  verifyCode(): void {
    if (this.userActivationForm.valid) {
      this.ui.showLoading();
      const formData = new FormData();
      formData.append(
        "codeNum",
        this.userActivationForm.controls.codeNum.value
      );
      this.httpService.post("", formData).subscribe(
        (response: any) => {
          this.ui.dismissLoading();
          if (response.status == 200) {
            this.httpError = "";
            this.userActivationForm.reset();
            // this.router.navigate(["user/email"]);
          }
        },
        (e) => {
          this.httpError = "código inválido";
          this.ui.dismissLoading();
        }
      );
    }
  }

  public inputValidatorAlphaNumeric(event: any) {
    const pattern = /^[a-zA-ZnÑ0-9 ]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-zA-ZnÑ0-9 ]/g, "");
    }
  }

  public getMessageform(item: any): string {
    if (item.hasError("required")) {
      return "Este campo es obligatorio";
    } else if (item.hasError("pattern")) {
      return "Ingrese solo letras y números";
    }
  }
}
