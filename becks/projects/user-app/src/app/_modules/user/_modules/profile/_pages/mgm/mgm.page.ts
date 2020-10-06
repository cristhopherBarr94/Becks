import { Component, OnInit } from "@angular/core";
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
import { environment } from "src/environments/environment";
import { UtilService } from "src/app/_services/util.service";

declare global {
  interface Window {
    dataLayer: any[];
  }
}
@Component({
  selector: "user-mgm",
  templateUrl: "./mgm.page.html",
  styleUrls: ["./mgm.page.scss"],
})
export class MGMPage implements OnInit {
  public userMGMForm: FormGroup;
  public userMGM: User = new User();
  public captchaStatus: boolean;
  public restartCaptcha: boolean;
  public httpError: string;
  public guest_users: any = [];

  constructor(
    private formBuilder: FormBuilder,
    public httpService: HttpService,
    private router: Router,
    private ui: UiService,
    private utils: UtilService
  ) {}

  ngOnInit(): void {
    this.initforms();
  }

  initforms() {
    this.userMGMForm = this.formBuilder.group({
      email: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
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
  inviteFriend(): void {
    if (this.userMGMForm.valid) {
      // this.ui.showLoading();
      const email256 = this.utils.getSHA256(this.userMGM.email);
      this.guest_users.push(this.userMGM.email);
      console.log(this.guest_users);
      // this.httpService
      //   .patch(environment.serverUrl + environment.guest.patchPassword, {
      //     email: this.userMGM.email,
      //     captcha: this.userMGM.captcha,
      //     captcha_key: this.userMGM.captcha_key,
      //   })
      //   .subscribe(
      //     (data: any) => {
      //       try {
      //         this.restartCaptcha = false;
      //         this.ui.dismissLoading();
      //         this.userMGMForm.reset();
      //         window.dataLayer.push({
      //           event: "trackEvent",
      //           eventCategory: "becks society",
      //           eventAction: "finalizar",
      //           eventLabel: email256,
      //         });
      //       } catch (e) {}
      //       this.router.navigate(["/user/email"], {
      //         queryParamsHandling: "preserve",
      //       });
      //     },
      //     (err) => {
      //       this.restartCaptcha = false;
      //       if (err.error) {
      //         this.httpError = err.error.message;
      //       }
      //       this.ui.dismissLoading();
      //     }
      //   );
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
