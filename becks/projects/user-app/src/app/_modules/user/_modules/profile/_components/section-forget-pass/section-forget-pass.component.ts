import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  Output,
  ViewChild,
} from "@angular/core";
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
  sendEmail(): void {
    if (this.userRegisterForm.valid) {
      this.ui.showLoading();
      const formData = new FormData();
      formData.append("email", this.userRegisterForm.controls.email.value);
      this.httpService.post("", formData).subscribe(
        (response: any) => {
          this.ui.dismissLoading();
          if (response.status == 200) {
            this.httpError = "";
            this.userRegisterForm.reset();
            // this.router.navigate(["user/email"]);
          }
        },
        (e) => {
          this.httpError = "Email incorrecto";
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
}
