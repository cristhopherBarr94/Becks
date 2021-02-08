import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { IonSlides, Platform } from "@ionic/angular";
import { Subscription } from "rxjs";
import { Exp } from "src/app/_models/exp";
import { ExperienciasService } from "src/app/_services/experiencias.service";
import { UiService } from "src/app/_services/ui.service";
import { UserService } from "src/app/_services/user.service";
import { SoldMessageComponent } from "src/app/_modules/user/_components/sold-message/sold-message.component";
import { RedemptionsService } from "src/app/_services/redemptions.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "user-slider-exp",
  templateUrl: "./slider-exp.component.html",
  styleUrls: ["./slider-exp.component.scss"],
})
export class SliderExpComponent
  implements OnInit, OnDestroy, AfterContentChecked, AfterViewInit {
  public id: number;
  public initialSlide;
  public size: string;
  public isActivate: boolean = false;
  public detalleExp: boolean = false;
  private modalIsShowed: boolean = false;
  private codes;
  private userCodeSubs: Subscription;
  private expSubs: Subscription;
  private redempSubs: Subscription;
  public experienciaContent: Exp[] = [];
  public slideOpts;
  public slideOptions;
  private redemps: number[] = [];
  public activeIndex: number;
  public DefaultSlide: boolean = false;
  public reserv: boolean = false;
  public hideDays: boolean = false;

  sliderExp = {
    isBeginningSlide: true,
    isEndSlide: false,
    slidesItems: undefined,
  };
  truePager = false;
  aumentarTamano = false;
  itemChange: number;
  disablePrevBtn = false;
  disableCounter: boolean;
  disableNextBtn = false;
  wasChecked = false;
  timerToChecked = 0;
  // status = 0;

  public defaultDeskImage =
    environment.serverUrl + environment.user.getImgExp + "0_desk";
  public defaultMobileImage =
    environment.serverUrl + environment.user.getImgExp + "0_mob";

  @ViewChild("slides") slides: IonSlides;

  constructor(
    private experienciaService: ExperienciasService,
    private router: Router,
    private userSvc: UserService,
    private platform: Platform,
    private ui: UiService,
    private redempSvc: RedemptionsService
  ) {
    platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.size = this.ui.getSizeType(platform.width());
      });
      this.size = this.ui.getSizeType(platform.width());
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.wasChecked = false;
      }
    });
  }

  ngAfterContentChecked(): void {
    if (!this.wasChecked) {
      window.clearTimeout(this.timerToChecked);
      this.timerToChecked = window.setTimeout(() => {
        this.wasChecked = true;
        this.ui.dismissLoading(0);
        this.getIndex();
      }, 1000);
    }
  }

  ngAfterViewInit() {}

  ngOnInit() {
    this.ui.showLoading();
    const s = this.router.url;
    this.id = Number(s.substr(s.lastIndexOf("/") + 1));

    this.experienciaContent = this.experienciaService.getActualExps();
    this.expSubs = this.experienciaService.exp$.subscribe(
      (response) => {
        try {
          if (response) {
            this.experienciaContent = response;
            this.sliderExp.slidesItems = response;
            this.slideOpts = {
              initialSlide: this.compareId(this.id == NaN ? 0 : this.id),
              direction: "horizontal",
              speed: 400,
              allowTouchMove: false,
            };
          }
        } catch (error) {}
        this.ui.dismissLoading();
      },
      (e) => {
        this.ui.dismissLoading();
      }
    );

    if (!this.experienciaContent || this.experienciaContent.length == 0) {
      this.ui.dismissLoading();
    }
    this.experienciaService.getData();

    this.redempSubs = this.redempSvc.redemp$.subscribe(
      (red) => {
        this.ui.dismissLoading();
        this.redemps = red;
      },
      (e) => {
        this.ui.dismissLoading();
      }
    );
    this.redempSvc.getData();

    this.userCodeSubs = this.userSvc.userCodes$.subscribe(
      (codes) => {
        this.ui.dismissLoading();
        if (codes && codes.length > 0) {
          this.isActivate = true;
          this.codes = codes;
        }
      },
      (e) => {
        this.ui.dismissLoading();
      }
    );
    this.userSvc.getCodes();
  }

  ngOnDestroy(): void {
    this.userCodeSubs.unsubscribe();
    this.expSubs.unsubscribe();
    this.redempSubs.unsubscribe();
  }

  detalleExperiencia(item: any) {
    this.itemChange = item;
    this.experienciaContent[item].detalleExp = !this.experienciaContent[item]
      .detalleExp;
    this.truePager = !this.truePager;
    this.aumentarTamano = true;
    // if (this.aumentarTamano) {
    // this.ampliarExp();
    // }
  }

  compareId(idExp: number) {
    for (let i = 0; i < this.experienciaContent.length; i++) {
      if (this.experienciaContent[i].id == idExp) {
        return i;
      }
    }
    return 0;
  }

  redirectToAct(nameExp: String) {
    this.router.navigate([`user/activation/`], {
      queryParamsHandling: "preserve",
    });
    window.dataLayer.push({
      event: "trackEvent",
      eventCategory: "fase 3",
      eventAction: "activa tu cuenta",
      eventLabel: nameExp,
    });
  }

  checkCodes(CurrentSld: any) {
    for (let i = 0; i < this.experienciaContent.length; i++) {
      // hide days announcer when exp is free
      if (this.experienciaContent[CurrentSld].type == "3") {
        this.hideDays = true;
      } else {
        this.hideDays = false;
      }

      // evaluate redemp status
      if (this.redemps) {
        for (let _id of this.redemps) {
          if (_id == this.experienciaContent[CurrentSld].id) {
            //pop up message error
            this.reserv = true;
          }
        }
      }
      if (this.codes && this.codes.length > 0) {
        // this.experienciaContent[CurrentSld].status == '2' &&
        if (
          this.experienciaContent[CurrentSld].stock_actual == "0" &&
          this.modalIsShowed == false &&
          this.experienciaContent[CurrentSld].status != "2" &&
          !this.reserv
        ) {
          this.modalIsShowed = true;
          this.ui.showModal(
            SoldMessageComponent,
            "modal-sold-message",
            true,
            true,
            {
              Func: this.closeModal.bind(this),
            }
          );
        }
      }
    }
  }

  async getIndex() {
    if (this.slides) {
      this.activeIndex = await this.slides.getActiveIndex();
      this.checkCodes(this.activeIndex);
      this.disableNextBtn =
        this.experienciaContent.length - 1 == this.activeIndex;
      if (this.activeIndex == 0) {
        this.disablePrevBtn = true;
        this.disableCounter = true;
      } else {
        this.disablePrevBtn = false;
        this.disableCounter = false;
      }
    }
  }

  redirInteraction() {
    window.open("https://www.feriadelmillon.com.co/becks/");
  }

  participateExperience(eid: number) {
    //check redemptions
    if (this.redemps) {
      for (let _id of this.redemps) {
        if (_id == eid) {
          //pop up message error
          this.reserv = true;
          this.router.navigate([`user/access-forbidden/${eid}`]);
          return;
        }
      }
    }

    let exp = null;
    for (exp of this.experienciaContent) {
      if (exp.id == eid) {
        break;
      }
    }

    //notificacion message
    // switch( this.experienciaContent[eid-1].type ) {
    //   case "0" : break;
    //   case "1" : break;
    //   case "2" : break;
    // }
    if (exp.type == "0") {
      this.router.navigate([`user/confirm-interaction/`], {
        queryParamsHandling: "preserve",
        state: { exp: exp },
      });
    }
    //redirection
    else if (exp.type == "1") {
      window.open(exp.urlRedirect);
    }
    //question form
    else if (exp.type == "2") {
      this.router.navigate([`user/interaction/${eid}`]);
    }
    //free event
    else if (exp.type == "3") {
      this.router.navigate([`user/confirm-interaction/`], {
        queryParamsHandling: "preserve",
        state: { exp: exp },
      });
    }
  }

  public closeModal() {
    this.ui.dismissModal();
    this.modalIsShowed = false;
  }

  changeSlider() {
    this.reserv = false;
    if (this.itemChange !== undefined) {
      // console.log('cambio de slider # con click ->', this.itemChange);
      if (this.experienciaContent[this.itemChange].detalleExp === true) {
        this.experienciaContent[this.itemChange].detalleExp = !this
          .experienciaContent[this.itemChange].detalleExp;
        this.truePager = !this.truePager;
        this.itemChange = undefined;
        this.aumentarTamano = true;
        // if (this.aumentarTamano) {
        // this.ampliarExp();
        // }
      }
    }
    this.getIndex();
  }

  ampliarExp() {
    this.aumentarTamano = !this.aumentarTamano;
  }

  // Move to Next slide
  slideNext(object, slideView) {
    if (this.disableNextBtn) {
      var elmnt = document.getElementById("footer");
      elmnt.scrollIntoView();
    } else {
      slideView.slideNext(500).then(() => {
        this.checkIfNavDisabled(object, slideView);
      });
    }
  }

  // Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  // Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  // Call methods to check if slide is first or last to enable disbale navigation
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
      this.disablePrevBtn = istrue;
    });
  }
  checkisEnd(object, slideView) {
    // console.log("checkisEnd", object);
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
      this.disableNextBtn = istrue;
    });
  }

  getColorExp(exp: any): string {
    let colorClass = "";
    // free exp
    if (exp.type == "3" && !this.reserv && exp.stock_actual > 0) {
      colorClass = "free-color";
    }
    // reserved exp
    else if (this.reserv) {
      colorClass = "reserved-color";
    }
    // soon exp
    else if (exp.status == 2) {
      colorClass = "soon-color";
    }
    // sold out
    else if (exp.stock_actual == 0) {
      colorClass = "sold-color";
    }
    return colorClass;
  }
}
