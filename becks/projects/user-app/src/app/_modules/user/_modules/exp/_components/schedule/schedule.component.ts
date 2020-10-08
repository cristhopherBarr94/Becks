import { Component, OnInit, ViewChild } from "@angular/core";
import { MatCalendar } from "@angular/material/datepicker";

@Component({
  selector: "user-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"],
})
export class ScheduleComponent implements OnInit {
  DayAndDate: string;
  eventDay = [];
  showEvent: boolean;
  events = [
    "10/08/2020",
    "19/10/2020",
    "2020/11/11",
    "2020/11/19",
    "2020/12/24",
  ];
  eventList = [
    {
      title: "Bruno Be",
      hour: "9:00 AM — 10:00 AM",
      members: {
        user_1: "@mario_casas",
        user_2: "@juliana_santa",
        user_3: "@diana_mal",
      },
      color: "#038259",
      icon: "",
    },
    {
      title: "Vintage",
      hour: "11:00 PM — 4:00 AM",
      members: {
        user_1: "@juliana_santa",
        user_2: "@diana_mal",
      },
      color: "#DB4843",
      icon: "",
    },
    {
      title: "Frank video clip",
      hour: "11:00 PM — 4:00 AM",
      members: {
        user_1: "@juliana_santa",
        user_2: "@diana_mal",
      },
      color: "#E362F8",
      icon: "",
    },
    {
      title: "Frank video clip",
      hour: "11:00 PM — 4:00 AM",
      members: {
        user_1: "@juliana_santa",
        user_2: "@diana_mal",
      },
      color: "#E362F8",
      icon: "",
    },
  ];
  options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "long",
  };
  public selectedDate: Date;
  public minDate: Date;
  public maxDate: Date;
  public minDate2: Date;
  public maxDate2: Date;
  public count: number = 0;
  currentYear = new Date().getFullYear();
  @ViewChild("calendar1", { static: false }) calendar1: MatCalendar<Date>;
  @ViewChild("calendar2", { static: false }) calendar2: MatCalendar<Date>;
  constructor() {}

  ngOnInit() {
    this.toDate();
    this.selectedDate = new Date();
    this.minDate = new Date();
    this.maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
    this.minDate2 = new Date(
      "2020" + "/" + (new Date().getMonth() + 2) + "/" + "01"
    );
    this.maxDate2 = new Date(new Date().setMonth(new Date().getMonth() + 2));
    this.currentYear = new Date().getFullYear();
    this.onSelect(this.selectedDate);
  }
  toDate() {
    this.events.forEach((singleEvent) => {
      let fecha = new Date(singleEvent)
        .toLocaleDateString("es-ES", this.options)
        .split(" ");
      this.eventDay.push(fecha);
    });
  }
  onSelect(event) {
    this.showEvent = false;
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
