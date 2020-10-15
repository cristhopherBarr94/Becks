import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Exp } from 'src/app/_models/exp';
import { User } from 'src/app/_models/User';
import { ExperienciasService } from 'src/app/_services/experiencias.service';
import { UserService } from 'src/app/_services/user.service';


@Component({
  selector: 'user-slider-exp',
  templateUrl: './slider-exp.component.html',
  styleUrls: ['./slider-exp.component.scss'],
})
export class SliderExpComponent implements OnInit {
  public id: number;
  public initialSlide
  public slideOpts
  userSubscription: Subscription;

  experienciaContent: Exp[] = [];

  constructor(
    private experienciaService: ExperienciasService,
    private router: Router,
    private userSvc: UserService
  ) { }

  ngOnInit() {
    this.userSubscription = this.userSvc.user$.subscribe(
      (user: User) => {
        if (user !== undefined) {       
            this.experienciaContent.forEach(exp =>{
              exp.cuentaActiva = user.activate;
            });
        }
      },
      (error: any) => {}
    );
    
    this.id = Number(this.router.url.replace("/user/exp/",""))
    this.experienciaService.getExpContent().subscribe(response => {
      this.experienciaContent = response;
      this.slideOpts = {
        initialSlide: this.compareId(this.id == NaN ? 0: this.id),
        direction: "vertical",
        speed: 400
      };  
    });
   console.log( this.router.url)
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

}
