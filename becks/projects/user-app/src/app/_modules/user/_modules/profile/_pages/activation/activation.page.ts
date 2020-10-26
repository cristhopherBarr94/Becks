import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from "@angular/core";
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
import { ModalController, Platform } from '@ionic/angular';
import { NotifyModalComponent } from 'src/app/_modules/utils/_components/notify-modal/notify-modal.component';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { SHA256 } from 'crypto-js';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/_services/user.service';
import { MenuStatusService } from 'src/app/_services/menu-status.service';
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
export class ActivationPage implements OnInit, AfterViewInit, OnDestroy{
  public userActivationForm: FormGroup;
  public userActivation: User = new User();
  public captchaStatus: boolean;
  public restartCaptcha: boolean;
  public httpError: string;
  public title_modal:string;
  public sub_title_modal:string = "Mira las nuevas experiencias que tenemos para ti"; 
  public title_button_modal:string = "ir a  experiencias";
  public prom_cod_modal:string = "HJASDYASU5145";
  public allow:boolean;
  public colorBg:string;
  public activate:boolean=false;
  public date_til : any;
  public used_date : any;
  public days_ramaining : any;
  public user: User;
  private subscribe: Subscription;
  private subsCodes: Subscription;
  private modal: any;
  public size: string;

  @ViewChild(HeaderComponent) header: HeaderComponent;
  title: string = "activa tu cuenta";
  prevUrl: string = "/user/exp";

  constructor(
    private formBuilder: FormBuilder,
    public httpService: HttpService,
    private router: Router,
    private ui: UiService,
    private modalCtrl: ModalController,
    private userSvc: UserService,
    private menuS : MenuStatusService,
    private platform: Platform ) { 
      platform.ready().then(() => {
        this.platform.resize.subscribe(() => {
          this.size = this.ui.getSizeType(platform.width());
        });
        this.size = this.ui.getSizeType(platform.width());
      });
    }

  ngOnInit(): void {
    this.subscribe = this.userSvc.user$.subscribe(user =>{
      this.user = user;
    });
    
    this.subsCodes = this.userSvc.userCodes$.subscribe(
      ( codes ) => {
        if ( codes && codes.length>0 ) {
          this.activate = true;
          this.date_til = moment(new Date(codes[0].valid_until * 1000));
          let cur_date = moment(new Date);
          this.days_ramaining =  (this.date_til.diff(cur_date, 'days')+1);
          if(this.days_ramaining>30){
            this.days_ramaining=30;
          }
          this.title_modal = "TIENES TU CUENTA ACTIVA POR "+ (this.days_ramaining)+ " DÍAS";
          this.bgActive();
          this.ui.showModal( NotifyModalComponent, "modalMessage", true, false, {
            title: this.title_modal,
            sub_title: this.sub_title_modal,
            title_button: this.title_button_modal,
            prom_cod:this.prom_cod_modal,
            allow: this.allow,
            Func: this.redirectTo.bind(this),
          });          
        } else {
          this.verifyCode();
        }
      }
    );
    
    this.userSvc.getCodes(true);
    this.initforms();
    this.bgActive();
    this.menuS.statusMenu("activate") 
  }

  ngOnDestroy(){
    this.subscribe.unsubscribe();
    this.subsCodes.unsubscribe();
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

  verifyCode():void {
    this.ui.dismissLoading();
    if (this.userActivationForm.valid) {
      this.ui.showLoading();
      const cid = this.userActivationForm.controls.codeNum.value.trim();
      const code256 = SHA256(cid).toString();
      this.httpService.patch(environment.serverUrl + environment.user.patchActivate, {
        cid: cid
      }).subscribe(
        (response: any) => {
          if (response.status == 200 && response.body.length >0) {
            this.httpError = "";
            this.userActivationForm.reset();
            window.dataLayer.push({
              'event': 'trackEvent',
              'eventCategory': 'fase 3',
              'eventAction': 'continuar codigo de compra',
              'eventLabel': code256,
            });
          }
          this.ui.dismissLoading();
          window.location.reload();

        },
        (e) => {
          this.httpError = "código inválido o en uso";
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
  this.ui.dismissModal();
  this.router.navigate(["user/exp"], {
    queryParamsHandling: "preserve",
    state: {reload: true}
  });
}
public bgActive(){
  if (this.activate==true) {
    this.colorBg = "bg-color";
  } else if (this.activate == false) {
    this.colorBg =  "bg-grey";
  }
}

closeActivation(){
  this.router.navigate(["user/exp"], {
    queryParamsHandling: "preserve",
    state: {reload: true}
  });
}

}
