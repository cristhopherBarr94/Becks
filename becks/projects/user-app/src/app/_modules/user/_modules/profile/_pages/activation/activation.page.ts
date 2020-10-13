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
import { ModalController } from '@ionic/angular';
import { NotifyModalComponent } from 'src/app/_modules/utils/_components/notify-modal/notify-modal.component';

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
  public title_modal:string = "TIENES TU CUENTA ACTIVA POR 30 DÍAS";
  public sub_title_modal:string = "Mira las nuevas experiencias que tenemos para ti"; 
  public title_button_modal:string = "VER EXPERIENCIAS";
  public prom_cod_modal:string = "HJASDYASU5145";
  public allow:boolean;

  @ViewChild(HeaderComponent) header: HeaderComponent;
  title: string = "activa tu cuenta";
  prevUrl: string = "/home";

  constructor(
    private formBuilder: FormBuilder,
    public httpService: HttpService,
    private router: Router,
    private ui: UiService,
    private modalCtrl: ModalController,
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
            this.showModal();
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
public redirectTo() {
   this.router.navigate(["user/exp"]);
}
  async showModal() {
    const modal = await this.modalCtrl.create({
      component: NotifyModalComponent,
      cssClass: "modalMessage",
      componentProps: {
        title: this.title_modal,
        sub_title: this.sub_title_modal,
        title_button: this.title_button_modal,
        prom_cod:this.prom_cod_modal,
        allow: this.allow,
        Func: this.redirectTo.bind(this),
      },
    });
    await modal.present();
    modal.onDidDismiss().then((res) => {
    });
  }
}
