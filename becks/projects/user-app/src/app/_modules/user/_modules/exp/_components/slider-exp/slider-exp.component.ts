import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Exp } from 'src/app/_models/exp';
import { User } from 'src/app/_models/User';
import { ExperienciasService } from 'src/app/_services/experiencias.service';
import { UiService } from 'src/app/_services/ui.service';
import { UserService } from 'src/app/_services/user.service';
import { SoldMessageComponent } from 'src/app/_modules/user/_components/sold-message/sold-message.component';
import { RedemptionsService } from 'src/app/_services/redemptions.service';


@Component({
  selector: 'user-slider-exp',
  templateUrl: './slider-exp.component.html',
  styleUrls: ['./slider-exp.component.scss'],
})
export class SliderExpComponent implements OnInit, OnDestroy {
  public id: number;
  public initialSlide
  public size: string;
  public isActivate:boolean=false;
  public detalleExp:boolean = false;
  private modalIsShowed:boolean=false;
  private codes;
  private userCodeSubs: Subscription;
  private expSubs: Subscription;
  private redempSubs: Subscription;
  public experienciaContent: Exp[] = [];
  public slideOpts;
  private redemps: number[] = [];
  sliderExp = {
    isBeginningSlide: true,
    isEndSlide: false,
    slidesItems: undefined
  };
  truePager = false;
  aumentarTamano = false;
  itemChange: number;
  disablePrevBtn = false;
  disableNextBtn = false;
  @ViewChild('slides') slides: IonSlides;

  constructor(
    private experienciaService: ExperienciasService,
    private router: Router,
    private userSvc: UserService,
    private platform: Platform,
    private ui: UiService,
    private redempSvc: RedemptionsService
  ) {
    this.ui.dismissLoading(0);
    platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.size = this.ui.getSizeType(platform.width());
      });
      this.size = this.ui.getSizeType(platform.width());
    });
  }

  ngOnInit() {
    this.ui.showLoading();
    const s = this.router.url;
    this.id = Number(s.substr(s.lastIndexOf('/') + 1));
    
    this.experienciaContent = this.experienciaService.getActualExps();
    this.expSubs = this.experienciaService.exp$.subscribe(response => {
      try {
        if ( response ) {
          this.experienciaContent = response;
          this.sliderExp.slidesItems = response;
          this.slideOpts = {
            initialSlide: this.compareId(this.id == NaN ? 0: this.id),
            direction: "vertical",
            speed: 400
            
          };
        }
        
      } catch (error) {
      }
      this.ui.dismissLoading();
    }, (e) => {
      this.ui.dismissLoading();
    });
    
    if ( !this.experienciaContent || this.experienciaContent.length==0 ) {
      this.ui.dismissLoading();
    }
    this.experienciaService.getData();

    this.redempSubs = this.redempSvc.redemp$.subscribe(
      ( red ) => {
        this.redemps = red;
        this.ui.dismissLoading();
    }); 
    this.redempSvc.getData();

    this.userCodeSubs = this.userSvc.userCodes$.subscribe( 
      ( codes ) => {
        if(codes && codes.length>0){
          this.isActivate = true;
          this.codes = codes;
          this.getIndex();
          this.ui.dismissLoading();
        }
      }
    );
    this.userSvc.getCodes();
  }

  ngOnDestroy(): void {
    this.userCodeSubs.unsubscribe();
    this.expSubs.unsubscribe();
  }
  

  detalleExperiencia(item: any) {
    this.itemChange = item;
    this.experienciaContent[item].detalleExp = !this.experienciaContent[item].detalleExp;
    this.truePager = !this.truePager;
    if (this.aumentarTamano) {
      this.ampliarExp();
    }
  }

  compareId(idExp:number){
    for(let i=0 ; i<this.experienciaContent.length; i++){      
      if(this.experienciaContent[i].id == idExp ){
        return i
      }     
    }
    return 0 
  }

  activarCuenta( res ) {}


  checkCodes(CurrentSld:any) {

    if ( this.codes && this.codes.length > 0 ) { 
      for(let i=0 ; i<this.experienciaContent.length; i++){      
        // this.experienciaContent[CurrentSld].status == '2' &&
        if( this.experienciaContent[CurrentSld].stock_actual == '0' && this.modalIsShowed==false){
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
    if(this.slides) {
      const active = await this.slides.getActiveIndex();
      this.checkCodes(active);
      this.disableNextBtn = ( (this.experienciaContent.length-1) == active );
      if( active == 0){
        this.disablePrevBtn = true;
      }else {
        this.disablePrevBtn = false;
      }
    }
  }

  redirInteraction() {
    window.open("https://www.feriadelmillon.com.co/becks/");
  }

  
participateExperience(eid:number) {

  //check redemptions
  if ( this.redemps )  {
    for ( let _id of this.redemps ) {
      if ( _id == eid ) {
        //pop up message error
        this.router.navigate([`user/access-forbidden/${eid}`]);
        return;
      }
    }
  }

  console.log("participateExperience", this.experienciaContent[eid-1]);
  
  //notificacion message
  switch( this.experienciaContent[eid-1].type ) {
    case "0" : break;
    case "1" : break;
    case "2" : break;
  }
  if(this.experienciaContent[eid-1].type == "0"){
    this.router.navigate([`user/confirm-interaction/`], {
      queryParamsHandling: "preserve",
      state: { exp: this.experienciaContent[eid-1] }
    });

  }
  //redirection
  else if(this.experienciaContent[eid-1].type == "1"){
    window.open(this.experienciaContent[eid].urlRedirect);

  }
  //question form
  else if(this.experienciaContent[eid-1].type == "2"){
    this.router.navigate([`user/interaction/${eid}`]);

  }
}

public closeModal() {
  this.ui.dismissModal();
  this.modalIsShowed = false;
}


changeSlider() {
  // console.log('cambio de slider # si click ->', this.itemChange);
  if (this.itemChange !== undefined) {
    // console.log('cambio de slider # con click ->', this.itemChange);
    if (this.experienciaContent[this.itemChange].detalleExp === true) {
      this.experienciaContent[this.itemChange].detalleExp = !this.experienciaContent[this.itemChange].detalleExp;
      this.truePager = !this.truePager;
      this.itemChange = undefined;
      if (this.aumentarTamano) {
        this.ampliarExp();
      }
    }
  }
  this.getIndex();
}

ampliarExp() {
  this.aumentarTamano = !this.aumentarTamano;
}

// Move to Next slide
slideNext(object, slideView) {
  slideView.slideNext(500).then(() => {
    this.checkIfNavDisabled(object, slideView);
  });
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
  console.log("checkisEnd" , object);
  slideView.isEnd().then((istrue) => {
    object.isEndSlide = istrue;
    this.disableNextBtn = istrue;
  });
}

}
