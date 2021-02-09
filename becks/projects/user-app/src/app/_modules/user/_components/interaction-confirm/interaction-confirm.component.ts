import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { HeaderComponent } from "src/app/_modules/utils/_components/header/header.component";
import { HttpService } from "src/app/_services/http.service";
import { UiService } from "src/app/_services/ui.service";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { User } from "src/app/_models/User";
import { ExperienciasService } from "src/app/_services/experiencias.service";
import { RedemptionsService } from "src/app/_services/redemptions.service";
import { UserService } from "src/app/_services/user.service";
import { Subscription } from "rxjs";
import { Exp } from "src/app/_models/exp";
import { BasicAlertComponent } from "src/app/_modules/utils/_components/basic-alert/basic-alert.component";

declare global {
  interface Window {
    dataLayer: any[];
  }
}
@Component({
  selector: "user-interaction-confirm",
  templateUrl: "./interaction-confirm.component.html",
  styleUrls: ["./interaction-confirm.component.scss"],
})
export class InteractionConfirmComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(HeaderComponent) header: HeaderComponent;
  prevUrl: string = "/user/exp";
  public experience: Exp;
  public userRegisterForm: FormGroup;
  public userRegister: User = new User();
  public httpError: string;
  public size: string;
  public isChecked = false;
  public showMessage = false;

  constructor(
    public httpService: HttpService,
    private router: Router,
    private platform: Platform,
    private ui: UiService,
    private formBuilder: FormBuilder,
    private expService: ExperienciasService,
    private userSvc: UserService,
    private redempSv: RedemptionsService
  ) {
    platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.size = this.ui.getSizeType(platform.width());
      });
      this.size = this.ui.getSizeType(platform.width());
    });
    try {
      this.experience = this.router.getCurrentNavigation().extras.state.exp;
    } catch (error) {
      this.router.navigate(["/user/exp/" + this.experience.id]);
    }
  }

  ngOnDestroy(): void {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.header.urlComponent = this.prevUrl;
  }

  setStatus(chk: boolean) {
    this.isChecked = chk;
    if (chk == false) {
      this.showMessage = true;
    } else {
      this.showMessage = false;
    }
  }

  redempExp() {
    if (!this.isChecked) {
      this.showMessage = true;
    } else {
      const codes = this.userSvc.getActualUserCodes();
      let code = -1;
      if (codes[0]) {
        code = parseInt(codes[0].id);
      }
      this.ui.showLoading();
      this.redempSv
        .postRedemption(parseInt(this.experience.id + ""), code)
        .subscribe(
          (res) => {
            this.ui.dismissLoading(0);
            if (res.status >= 200 && res.status < 300) {
              this.expService.getData();
              this.redempSv.getData();
            } else {
              this.ui.showModal(
                BasicAlertComponent,
                "modalMessage",
                false,
                false,
                {
                  title: "Error interno",
                  description: "Intenta de nuevo mas tarde",
                }
              );
              this.ui.dismissModal();
            }
            this.router.navigate(["/user/exp/" + this.experience.id]);
          },
          (e) => {
            this.ui.dismissLoading(0);
            this.router.navigate(["/user/exp/" + this.experience.id]);
          }
        );
    }
  }

  getImgExp() {
    if (this.size == "mob") {
      return this.experience.imagesExpMob;
    } else if (this.size == "desk") {
      return this.experience.imagesExp;
    } else {
      return this.experience.imagesExp;
    }
  }
}
