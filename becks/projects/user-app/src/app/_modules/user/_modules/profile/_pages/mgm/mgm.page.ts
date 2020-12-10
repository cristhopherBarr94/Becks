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
import { environment } from "src/environments/environment";
import { UtilService } from "src/app/_services/util.service";
import { MenuStatusService } from "src/app/_services/menu-status.service";
import { Platform } from "@ionic/angular";
import { NotifyModalComponent } from "src/app/_modules/utils/_components/notify-modal/notify-modal.component";

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
  public hide: boolean;
  public redemp: boolean = false;
  public isRedempted: boolean = false;
  public size: string;

  constructor(
    private formBuilder: FormBuilder,
    public httpService: HttpService,
    private router: Router,
    private ui: UiService,
    private utils: UtilService,
    private menuS: MenuStatusService,
    private platform: Platform
  ) {
    platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.size = this.ui.getSizeType(platform.width());
      });
      this.size = this.ui.getSizeType(platform.width());
    });
  }

  ngOnInit(): void {
    this.initforms();
    this.menuS.statusMenu("mgm");
  }

  initforms() {
    this.userMGMForm = this.formBuilder.group({
      email: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(200),
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
      if (this.guest_users.length < 6) {
        this.guest_users.push(this.userMGM.email);
        if (this.guest_users.length == 6) {
          let title_modal = "TUS AMIGOS SE UNIERON A LA BECK’S SOCIETY";
          let sub_title_modal =
            "Este es tu código para reclamar tu six pack en MERQUEO";
          let prom_cod_modal = "HJASDYASU5145";
          let allowed = true;
          this.ui.showModal(NotifyModalComponent, "modalMessage", true, false, {
            title: title_modal,
            sub_title_green: sub_title_modal,
            prom_cod: prom_cod_modal,
            allow: allowed,
            FuncAlt: this.redirectToAlt.bind(this),
          });
        }
        this.userMGMForm.controls.email.reset();
        // this.userMGMForm.controls.email.markAsUntouched();
      }
      const email256 = this.utils.getSHA256(this.userMGM.email);
      // console.log(this.guest_users);
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
  curRedemp() {
    if (this.isRedempted) {
      return "redempted-code";
    } else {
      return "redemp-code";
    }
  }

  deleteReq(id: number) {
    this.guest_users.splice(id, 1);
  }

  public redirectToAlt() {
    this.ui.dismissModal();
    this.router.navigate(["user/profile"], {
      queryParamsHandling: "preserve",
      state: { reload: true },
    });
  }
}
