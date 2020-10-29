import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Exp } from 'src/app/_models/exp';
import { ExperienciasService } from 'src/app/_services/experiencias.service';



@Component({
  selector: 'user-slider-exp',
  templateUrl: './slider-exp.component.html',
  styleUrls: ['./slider-exp.component.scss'],
})
export class SliderExpComponent implements OnInit {

  slideOpts = {
    direction: "vertical",
    speed: 400,
    scrollbar: true,
    navigation: {
      hideOnClick: true
    }
    }

  experienciaContent: Exp[] = [];

  constructor(
    public navCtrl: NavController,
    private experienciaService: ExperienciasService
  ) { }

  ngOnInit() {
    this.experienciaService.getExpContent().subscribe(response => {
      this.experienciaContent = response;
      console.log('esta es la data ->', this.experienciaContent);
    });
  }

  activarCuenta(item: any) {
    this.experienciaContent[item].cuentaActiva = !this.experienciaContent[item].cuentaActiva;
  }

  detalleExperiencia(item: any) {
    this.experienciaContent[item].detalleExp = !this.experienciaContent[item].detalleExp;
    this.slideOpts.scrollbar = !this.slideOpts.scrollbar;
    console.log('este es el estado del scroll ->', this.slideOpts.scrollbar);

  }

}
