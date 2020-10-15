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
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
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
  public title_modal:string;
  public sub_title_modal:string = "Mira las nuevas experiencias que tenemos para ti"; 
  public title_button_modal:string = "VER EXPERIENCIAS";
  public prom_cod_modal:string = "HJASDYASU5145";
  public allow:boolean;
  public colorBg:string;
  public activate:boolean;
  public date_til : any;
  public used_date : any;
  public days_ramaining : any;

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
    this.activate=false;
    this.initforms();
    this.getActiveCode();
    this.bgActive();
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
  
 getActiveCode(): void {
  this.ui.showLoading();
    this.httpService.get(environment.serverUrl + environment.user.getCodes).subscribe(
      (res: any) => {

        this.date_til = moment(new Date(res.body[0].valid_until * 1000));
        this.used_date = moment(new Date(res.body[0].used* 1000));
        this.days_ramaining =  this.date_til.diff(this.used_date, 'days');
        this.title_modal = "TIENES TU CUENTA ACTIVA POR "+ this.days_ramaining+ " DÍAS";
        console.log(this.days_ramaining);
        
        this.ui.dismissLoading();

        if (res.status == 200 && res.body.length >0) {
          this.activate=true;
          this.bgActive();
          this.showModal();
        }
      },
      (err) => {
          this.verifyCode();
      }
    );

  }
  verifyCode():void {
    if (this.userActivationForm.valid) {
      this.ui.showLoading();
      
      this.httpService.patch(environment.serverUrl + environment.user.patchActivate, {
        cid: this.userActivationForm.controls.codeNum.value
      }).subscribe(
        (response: any) => {
          this.ui.dismissLoading();
          if (response.status == 200 && response.body.length >0) {
            this.activate=true;
            this.bgActive();
            this.showModal();
            this.httpError = "";
            this.userActivationForm.reset();
           
          }
        },
        (e) => {
          this.httpError = "código invalido";
          this.ui.dismissLoading();
          this.activate=false; 
          this.userActivationForm.reset();
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
public bgActive(){
  if (this.activate==true) {
    this.colorBg = "bg-color";
  } else if (this.activate == false) {
    this.colorBg =  "bg-grey";
  }
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
        backdropDismiss:false,
        keyboardClose:false,
        swipeToClose:false,
      });
      await modal.present();
      modal.onDidDismiss().then((res) => {
      });
  }
}
