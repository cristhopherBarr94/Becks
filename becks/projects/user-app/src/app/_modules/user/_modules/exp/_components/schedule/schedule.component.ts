import { Component, OnInit } from "@angular/core";

@Component({
  selector: "user-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"],
})
export class ScheduleComponent implements OnInit {
  selectedDate = new Date();
  startAt = new Date();
  minDate = new Date();
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
  minDate2 = new Date(new Date().setMonth(new Date().getMonth() + 1));
  maxDate2 = new Date(new Date().setMonth(new Date().getMonth() + 2));
  currentYear = new Date().getFullYear();
  DayAndDate: string;
  eventDay = new Date("2020/10/18");
  showEvent: boolean;
  constructor() {}

  ngOnInit() {}

  onSelect(event) {
    console.log(event);
    this.selectedDate = event;
    const dateString = event.toDateString();
    const dateValue = dateString.split(" ");
    this.DayAndDate =
      dateValue[0] + "," + " " + dateValue[1] + " " + dateValue[2];
    if (this.selectedDate.getDay() == this.eventDay.getDay()) {
      console.log("existe evento");
      this.showEvent = true;
    } else {
      this.showEvent = false;
    }
  }

  myDateFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };
}
