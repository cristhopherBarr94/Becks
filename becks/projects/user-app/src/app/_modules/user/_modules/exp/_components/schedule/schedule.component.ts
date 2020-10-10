import { Component, OnInit, ViewChild } from "@angular/core";
import { MatCalendar } from "@angular/material/datepicker";
import { MockExperiencias } from "../../../../../../_mocks/experiencias-mock";


@Component({
  selector: "user-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"],
})
export class ScheduleComponent implements OnInit {
  DayAndDate: string;
  eventDay = [];
  events = [];
  eventList = MockExperiencias;
  options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "long",
  };
  public selectedDate: Date;
  public auxDate:string;
  public showEvent:boolean;
  public stringCom:string;
  public minDate: Date;
  public maxDate: Date;
  public minDate2: Date;
  public maxDate2: Date;
  public count: number = 0;
  public colorClass: string;
  currentYear = new Date().getFullYear();
  @ViewChild("calendar1", { static: false }) calendar1: MatCalendar<Date>;
  @ViewChild("calendar2", { static: false }) calendar2: MatCalendar<Date>;
  constructor() {}

  ngOnInit() {
    this.selectedDate = new Date();
    this.minDate = new Date();
    this.maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
    this.minDate2 = new Date(
      "2020" + "/" + (new Date().getMonth() + 2) + "/" + "01"
    );
    this.maxDate2 = new Date(new Date().setMonth(new Date().getMonth() + 2));
    this.currentYear = new Date().getFullYear();    
    this.eventList.forEach(fecha =>{
      this.events.push(fecha.fechaExp);
    });
    this. toDate() 
    this.onSelect(this.selectedDate);
  }
  toDate() {
    this.events.forEach((singleEvent) => {
      let fecha = new Date(singleEvent)
        .toLocaleDateString("es-ES", this.options)
        .split(" ");
      this.eventDay.push(fecha);
      console.log(this.eventDay);

    });
  }
  onSelect(event) {
    this.showEvent = false;
    this.auxDate = event.toLocaleDateString();
    let stringDate2 = this.auxDate.split("/");
    this.stringCom = stringDate2[1]+"/"+stringDate2[0]+"/"+stringDate2[2];

    this.selectedDate = event;
    const dateString = this.selectedDate.toLocaleDateString(
      "es-ES",
      this.options
    );
    const dateValue = dateString.split(" ");
    this.currentYear = new Date().getFullYear();
    this.DayAndDate = dateValue[0] + " " + dateValue[3] + " " + dateValue[1];
    for (var j = 0; j < this.eventDay.length; j++) {
      if (
        (dateValue[1] == this.eventDay[j][1] &&
          dateValue[3] == this.eventDay[j][3]) ||
        (this.selectedDate[1] == this.eventDay[j][1] &&
          this.selectedDate[3] == this.eventDay[j][3])
      ) {
        this.showEvent = true;
      }
    }
  }
  previousDate() {
    this.calendar1._goToDateInView(
      (this.minDate = new Date(new Date().setMonth(new Date().getMonth()))),
      "month"
    );
    this.calendar2._goToDateInView(
      (this.minDate2 = new Date(
        this.currentYear + "/" + (new Date().getMonth() + 2) + "/" + "01"
      )),
      "month"
    );
  }
  nextDate() {
    this.calendar1._goToDateInView(
      (this.minDate = new Date(new Date().setMonth(new Date().getMonth() + 1))),
      "month"
    );
    this.calendar2._goToDateInView(
      (this.minDate2 = new Date(
        this.currentYear + "/" + (new Date().getMonth() + 3) + "/" + "01"
      )),
      "month"
    );
  }

}
