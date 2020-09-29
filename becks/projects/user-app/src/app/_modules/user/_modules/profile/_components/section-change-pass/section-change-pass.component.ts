import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { UiService } from "src/app/_services/ui.service";
import { HttpService } from "src/app/_services/http.service";
import { Router } from "@angular/router";
import { HeaderComponent } from "src/app/_modules/utils/_components/header/header.component";
import { environment } from "src/environments/environment";
import { User } from "src/app/_models/User";

@Component({
  selector: "user-section-change-pass",
  templateUrl: "./section-change-pass.component.html",
  styleUrls: ["./section-change-pass.component.scss"],
})
export class SectionChangePassComponent implements OnInit, AfterViewInit {
  public userChangeForm: FormGroup;
  public userChange: User = new User();
  public httpError: string;
  public captchaStatus: boolean;
  public restartCaptcha: boolean;

  @ViewChild(HeaderComponent) header: HeaderComponent;
  prevUrl: string = "/home";

  constructor(
    private formBuilder: FormBuilder,
    private ui: UiService,
    private httpService: HttpService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initforms();
  }
  ngAfterViewInit(): void {
    this.header.urlComponent = this.prevUrl;
  }

  initforms() {
    this.userChangeForm = this.formBuilder.group({
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
    if (this.userChangeForm.valid) {
      this.ui.showLoading();
      this.userChange.password = this.userChangeForm.controls.password.value;
      this.httpService
        .patch(environment.serverUrl + environment.user.patchPassword, {
          password: this.userChange.password,
        })
        .subscribe(
          (response: any) => {
            this.ui.dismissLoading();
            if (response.status == 200) {
              this.httpError = "";
              this.userChangeForm.reset();
              this.router.navigate(["home"]);
            }
          },
          (e) => {
            this.httpError = "Contraseña incorrecta";
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
    if (item.hasError("password")) {
      return "Contraseña inválida";
    }
  }
  public setCaptchaStatus(status) {
    this.captchaStatus = status;
  }
}
