import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Exp } from 'src/app/_models/exp';
import { ExperienciasService } from 'src/app/_services/experiencias.service';


@Component({
  selector: 'user-slider-exp',
  templateUrl: './slider-exp.component.html',
  styleUrls: ['./slider-exp.component.scss'],
})
export class SliderExpComponent implements OnInit {
  public id: number;
  public initialSlide
  public slideOpts

  experienciaContent: Exp[] = [];

  constructor(
    private experienciaService: ExperienciasService,
    private router: Router
  ) { }

  ngOnInit() {
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

  activarCuenta(item: any) {
    this.experienciaContent[item].cuentaActiva = !this.experienciaContent[item].cuentaActiva;
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
