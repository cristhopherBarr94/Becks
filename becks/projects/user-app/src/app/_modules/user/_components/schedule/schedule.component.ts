import { Component, OnInit, ViewChild } from "@angular/core";
import { MatCalendar, MatCalendarCellClassFunction, MatCalendarCellCssClasses } from "@angular/material/datepicker";
import { Platform } from '@ionic/angular';
import { MockExperiencias } from 'src/app/_mocks/experiencias-mock';
import { MenuStatusService } from 'src/app/_services/menu-status.service';
import { UiService } from 'src/app/_services/ui.service';


@Component({
  selector: "user-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"],
})
export class ScheduleComponent implements OnInit {
  DayAndDate: string;
  eventDay = [];
  events = [];
  datesToHighlight = ["2020/10/23","2020/10/18","2020/10/29"];
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
  public size: string;

  currentYear = new Date().getFullYear();
  @ViewChild("calendar1", { static: false }) calendar1: MatCalendar<Date>;
  @ViewChild("calendar2", { static: false }) calendar2: MatCalendar<Date>;

 
  constructor(private menuS : MenuStatusService, private platform: Platform, private ui: UiService) {
    platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.size = this.ui.getSizeType(platform.width());
      });
      this.size = this.ui.getSizeType(platform.width());
      console.log(this.size);
    });
  }

  ngOnInit() {
    this.selectedDate = new Date();
    this.minDate = new Date();
    this.maxDate = new Date(new Date().setMonth(new Date().getMonth()));
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
    this.menuS.statusMenu("calendar")  
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
    console.log("atras");
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
      (this.minDate = new Date( this.currentYear + "/" + (new Date().getMonth() + 2) + "/" + "01")),
      "month"
    );
    this.calendar2._goToDateInView(
      (this.minDate2 = new Date(
        this.currentYear + "/" + (new Date().getMonth() + 3) + "/" + "01"
      )),
      "month"
    );
  }

   dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      const highlightDate = this.events
        .map(strDate => new Date(strDate))
        .some(d => d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear());
      return highlightDate ? 'special-date' : '';
    };
  }
 
  
}
