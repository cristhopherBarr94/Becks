import { Component, Input, OnInit } from '@angular/core';
import { Exp } from 'src/app/_models/exp';
import { ExperienciasService } from 'src/app/_services/experiencias.service';


@Component({
  selector: 'user-slider-exp',
  templateUrl: './slider-exp.component.html',
  styleUrls: ['./slider-exp.component.scss'],
})
export class SliderExpComponent implements OnInit {
  @Input() id: number;
  public initialSlide
  public slideOpts

  experienciaContent: Exp[] = [];

  constructor(
    private experienciaService: ExperienciasService
  ) { }

  ngOnInit() {
    this.experienciaService.getExpContent().subscribe(response => {
      this.experienciaContent = response;
      this.slideOpts = {
        initialSlide: this.compareId(!!this.id ? this.id : 0),
        direction: "vertical",
        speed: 400
      };  
    });
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
