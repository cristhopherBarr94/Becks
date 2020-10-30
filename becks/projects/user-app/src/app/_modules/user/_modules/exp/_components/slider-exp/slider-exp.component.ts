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
  experienciaContent: Exp[] = [];
  public slideOpts;
  // = {
  //   direction: "vertical",
  //   speed: 400,
  //   scrollbar: true,
  //   navigation: {
  //     hideOnClick: true
  //   }
  // };
  @ViewChild('slides') slides: IonSlides;

  constructor(
    private experienciaService: ExperienciasService,
    private router: Router,
    private userSvc: UserService,
    private platform: Platform,
    private ui: UiService,

  ) {
    platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.size = this.ui.getSizeType(platform.width());
      });
      this.size = this.ui.getSizeType(platform.width());
    });
  }

  ngOnInit() {
    
    const s = this.router.url;
    this.id = Number(s.substr(s.lastIndexOf('/') + 1));
    
    this.experienciaContent = this.experienciaService.getActualExps();
    this.expSubs = this.experienciaService.exp$.subscribe(response => {
      this.experienciaContent = response;
      this.slideOpts = {
        initialSlide: this.compareId(this.id == NaN ? 0: this.id),
        direction: "vertical",
        speed: 400
      };
    });
    
    // if ( !this.experienciaContent || this.experienciaContent.length==0 )
    this.experienciaService.getData();

    this.userCodeSubs = this.userSvc.userCodes$.subscribe( 
      ( codes ) => {
        if(codes && codes.length>0){
          this.isActivate = true;
          this.codes = codes;
          this.getIndex();
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
    this.experienciaContent[item].detalleExp = !this.experienciaContent[item].detalleExp;
    console.log("detalle experiencia",this.experienciaContent[item].id);
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
    
        if(this.experienciaContent[CurrentSld].status == '2' && this.modalIsShowed==false){
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
      this.checkCodes(await this.slides.getActiveIndex());
    }
  }

  redirInteraction() {
    window.open("https://www.feriadelmillon.com.co/becks/");
  }

  
participateExperience(arrayObject:number){
  console.log(arrayObject);
  if(this.experienciaContent[arrayObject-1].type == "0"){
    window.open(this.experienciaContent[arrayObject].urlRedirect);
  }
  else if(this.experienciaContent[arrayObject-1].type == "1"){
    this.router.navigate([`user/interaction/${arrayObject}`]);
  }
  else if(this.experienciaContent[arrayObject-1].type == "2"){
    this.router.navigate([`user/confirm-interaction/${arrayObject}`]);
  }
}

public closeModal() {
  this.ui.dismissModal();
  this.modalIsShowed = false;
}

}
