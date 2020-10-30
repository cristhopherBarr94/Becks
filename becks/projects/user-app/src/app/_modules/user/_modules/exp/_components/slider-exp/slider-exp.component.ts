import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Exp } from 'src/app/_models/exp';
import { ExperienciasService } from 'src/app/_services/experiencias.service';



@Component({
  selector: 'user-slider-exp',
  templateUrl: './slider-exp.component.html',
  styleUrls: ['./slider-exp.component.scss'],
})
export class SliderExpComponent implements OnInit {

  @ViewChild('slides') ionSlides: IonSlides;

  experienciaContent: Exp[] = [];

  slideOpts = {
    direction: 'vertical',
    speed: 400,
    loop: true
  };

  sliderExp = {
    isBeginningSlide: true,
    isEndSlide: false,
    slidesItems: undefined
  };

  disablePrevBtn = true;
  disableNextBtn = false;
  finalSlider: Promise<boolean>;
  itemChange: number;

  truePager = false;

  constructor(
    private experienciaService: ExperienciasService
  ) { }

  ngOnInit() {
    this.cargarExperiencias();
  }

  cargarExperiencias() {
    this.experienciaService.getExpContent().subscribe(response => {

      this.sliderExp.slidesItems = response;
    });
  }

  activarCuenta(item: any) {
    this.experienciaContent[item].cuentaActiva = !this.experienciaContent[item].cuentaActiva;
  }

  detalleExperiencia(item: any) {
    this.itemChange = item;
    this.experienciaContent[item].detalleExp = !this.experienciaContent[item].detalleExp;
    this.truePager = !this.truePager;
  }


  changeSlider() {
    console.log('cambio de slider # si click ->', this.itemChange);
    if (this.itemChange !== undefined) {
      console.log('cambio de slider # con click ->', this.itemChange);
      if (this.experienciaContent[this.itemChange].detalleExp === true) {
        this.experienciaContent[this.itemChange].detalleExp = !this.experienciaContent[this.itemChange].detalleExp;
        this.truePager = !this.truePager;
        this.itemChange = undefined;
      }
    }
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
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }

}
