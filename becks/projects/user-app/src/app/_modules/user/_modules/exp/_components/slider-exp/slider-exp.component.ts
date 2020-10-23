import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Exp } from 'src/app/_models/exp';
import { User } from 'src/app/_models/User';
import { ExperienciasService } from 'src/app/_services/experiencias.service';
import { UiService } from 'src/app/_services/ui.service';
import { UserService } from 'src/app/_services/user.service';



@Component({
  selector: 'user-slider-exp',
  templateUrl: './slider-exp.component.html',
  styleUrls: ['./slider-exp.component.scss'],
})
export class SliderExpComponent implements OnInit, OnDestroy {
  public id: number;
  public initialSlide
  public slideOpts
  public size: string;
  private codes;
  private userCodeSubs: Subscription;

  experienciaContent: Exp[] = [];

  constructor(
    private experienciaService: ExperienciasService,
    private router: Router,
    private userSvc: UserService,
    private platform: Platform,
    private ui: UiService,

  ) {
    if(this.router.getCurrentNavigation().extras.state?.reload) {
      // TODO :: FIX THIS ISSUE FROM CSS
      // AVOID RELOAD
      location.reload();
    }
    platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.size = this.ui.getSizeType(platform.width());
      });
      this.size = this.ui.getSizeType(platform.width());
      console.log(this.size);

    });
  }

  ngOnInit() {
    
    const s = this.router.url;
    this.id = Number(s.substr(s.lastIndexOf('/') + 1));
    this.experienciaService.getExpContent().subscribe(response => {
      this.experienciaContent = response;
      this.slideOpts = {
        initialSlide: this.compareId(this.id == NaN ? 0: this.id),
        direction: "vertical",
        speed: 400
      };
      this.checkCodes();
    });

    this.userCodeSubs = this.userSvc.userCodes$.subscribe( 
      ( codes ) => {
        this.codes = codes;
        this.checkCodes();
      }
    );
    
    this.userSvc.getCodes();
  }

  ngOnDestroy(): void {
    this.userCodeSubs.unsubscribe();
  }

  detalleExperiencia(item: any) {
    this.experienciaContent[item].detalleExp = !this.experienciaContent[item].detalleExp;
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

  checkCodes() {
    if ( this.codes && this.codes.length > 0 ) {       
      this.experienciaContent.forEach(exp =>{
        exp.cuentaActiva = true;
      });
    }
  }



  redirInteraction() {
    window.open("https://www.feriadelmillon.com.co/becks/");
  }

  
participateExperience(arrayObject:number){
  if(this.experienciaContent[arrayObject].type == "0"){
    window.open(this.experienciaContent[arrayObject].urlRedirect);
  }
  else if(this.experienciaContent[arrayObject].type == "1"){
    this.router.navigate([`user/interaction/${this.experienciaContent[arrayObject].id}`]);
  }
}


}
