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
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { BasicAlertComponent } from 'src/app/_modules/utils/_components/basic-alert/basic-alert.component';

@Component({
  selector: "user-section-change-pass",
  templateUrl: "./section-change-pass.component.html",
  styleUrls: ["./section-change-pass.component.scss"],
})
export class SectionChangePassComponent implements OnInit {
  public userChangeForm: FormGroup;
  public userChange: User = new User();
  public httpError: string;
  public captchaStatus: boolean;
  public restartCaptcha: boolean;
  public hide: boolean;
  public hide1: boolean;
  public hide2: boolean;
  public password: string;
  public passwordVerify: string;
  public passwordPrev: string;

  @ViewChild(HeaderComponent) header: HeaderComponent;
  prevUrl: string = "/home";

  constructor(
    private formBuilder: FormBuilder,
    private ui: UiService,
    private httpService: HttpService,
    private router: Router,
    private userSvc: UserService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.initforms();
  }
  // ngAfterViewInit(): void {
  //   this.header.urlComponent = this.prevUrl;
  // }

  initforms() {
    this.userChangeForm = this.formBuilder.group({
      passwordVerify: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
      ]),
      passwordPrev: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  changePass(): void {
    if (this.userChangeForm.valid) {
      this.ui.showLoading();
      this.userChange.password = this.userChangeForm.controls.password.value.trim();
      this.userChange.passwordPrev = this.userChangeForm.controls.passwordPrev.value.trim();

      if ( this.userChange.password == this.userChange.passwordPrev ) {
        this.ui.dismissLoading();
        this.httpError = "La nueva contraseña debe ser diferente a la anterior";
        return;
      }

      this.httpService
        .patch(environment.serverUrl + environment.user.patchPassword, {
          password: this.userChange.password, passwordPrev: this.userChange.passwordPrev,
        })
        .subscribe(
          (response: any) => {
            if (response.status == 200) {
              if ( response.body.password ) {
                this.userChangeForm.reset();
                this.userSvc.logout();
                this.auth.setAuthenticated(null);
                this.ui.showModal( BasicAlertComponent, "modalMessage", false, false, {
                  title: "Contraseña Actualizada",
                  description: "Cerrando sesión de forma segura",
                });
                this.ui.dismissModal();
                setTimeout( () => {
                  this.ui.dismissLoading();
                  this.router.navigate(["home"]);
                } , 3000 );
              } else {
                this.ui.dismissLoading();
                this.httpError = response.body.message ? response.body.message : "Contraseña actual no valida";
              }
            } else {
              this.httpError = response.body;
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
  public closeChange() {
    this.ui.dismissModal();
  }
}
