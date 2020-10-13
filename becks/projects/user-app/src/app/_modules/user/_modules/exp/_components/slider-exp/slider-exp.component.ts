import { Component, OnInit } from '@angular/core';
import { Exp } from 'src/app/_models/exp';
import { ExperienciasService } from 'src/app/_services/experiencias.service';


@Component({
  selector: 'user-slider-exp',
  templateUrl: './slider-exp.component.html',
  styleUrls: ['./slider-exp.component.scss'],
})
export class SliderExpComponent implements OnInit {
  public initialSlide

  experienciaContent: Exp[] = [];

  constructor(
    private experienciaService: ExperienciasService
  ) { }

  ngOnInit() {
    this.experienciaService.getExpContent().subscribe(response => {
      this.experienciaContent = response;
      console.log("SliderExpComponent -> ngOnInit -> response", response)
    });
  }

  activarCuenta(item: any) {
    this.experienciaContent[item].cuentaActiva = !this.experienciaContent[item].cuentaActiva;
  }

  detalleExperiencia(item: any) {
    this.experienciaContent[item].detalleExp = !this.experienciaContent[item].detalleExp;
  }

  slideOpts = {
    initialSlide: this.compareId(2),
    direction: "vertical",
    speed: 400
  };  


  compareId(idExp:number){
    for(let i=0 ; i<this.experienciaContent.length; i++){      
      if(this.experienciaContent[i].id == idExp ){
        return i
      }     
    }
    return 2 
  }

}
