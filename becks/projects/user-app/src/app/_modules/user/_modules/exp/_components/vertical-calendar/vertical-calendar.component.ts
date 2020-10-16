import { Component, OnInit } from "@angular/core";
import { MenuStatusService } from 'src/app/_services/menu-status.service';

@Component({
  selector: "user-vertical-calendar",
  templateUrl: "./vertical-calendar.component.html",
  styleUrls: ["./vertical-calendar.component.scss"],
})
export class VerticalCalendarComponent implements OnInit {
  public amount_exp: any = [
    {
      mes: "sep",
      dia: "12",
      titulo: "Bruno Be",
      fecha: "Viernes 12 sep, 9pm",
      img: "assets/img/exp-card-1.png",
    },
    {
      mes: "",
      dia: "25",
      titulo: "Vintage",
      fecha: "Lunes 25 oct, 9pm",
      img: "assets/img/exp-card-2.png",
    },
    {
      mes: "oct",
      dia: "10",
      titulo: "Beowulf",
      fecha: "Viernes 10 oct, 9pm",
      img: "assets/img/exp-card-3.png",
    },
    {
      mes: "",
      dia: "11",
      titulo: "Vintage",
      fecha: "Lunes 25 oct, 9pm",
      img: "assets/img/exp-card-1.png",
    },
    {
      mes: "",
      dia: "12",
      titulo: "Vintage",
      fecha: "Lunes 25 oct, 9pm",
      img: "assets/img/exp-card-2.png",
    },
    {
      mes: "",
      dia: "13",
      titulo: "Vintage",
      fecha: "Lunes 25 oct, 9pm",
      img: "assets/img/exp-card-3.png",
    },
    {
      mes: "nov",
      dia: "10",
      titulo: "Beowulf",
      fecha: "Viernes 10 oct, 9pm",
      img: "assets/img/exp-card-1.png",
    },
  ];
  constructor(private menuS : MenuStatusService) {}

  ngOnInit() {this.menuS.statusMenu("calendarmob")}
}
