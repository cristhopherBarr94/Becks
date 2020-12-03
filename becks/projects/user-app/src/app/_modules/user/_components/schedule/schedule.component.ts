import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {
  MatCalendar,
  MatCalendarCellClassFunction,
  MatCalendarCellCssClasses,
} from "@angular/material/datepicker";
import { Platform } from "@ionic/angular";
import { Subscription } from "rxjs";
import { ExperienciasService } from "src/app/_services/experiencias.service";
import { MenuStatusService } from "src/app/_services/menu-status.service";
import { UiService } from "src/app/_services/ui.service";

@Component({
  selector: "user-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"],
})
export class ScheduleComponent implements OnInit, OnDestroy {
  DayAndDate: string;
  eventDay = [];
  events = [];
  datesToHighlight = ["2020/10/23", "2020/10/18", "2020/10/29"];
  exps = [];
  options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "long",
  };
  public selectedDate: Date;
  public auxDate: string;
  public showEvent: boolean;
  public stringCom: string;
  public minDate: Date;
  public countMonth1: number = new Date().getMonth() + 1;
  public countMonth2: number;
  public minDate2: Date;
  public countYear1: number = new Date().getFullYear();
  public countYear2: number;
  public count: number = 0;
  public colorClass: string;
  public size: string;
  private expSubs: Subscription;
  public newEvents = true;

  currentYear = new Date().getFullYear();
  @ViewChild("calendar1", { static: false }) calendar1: MatCalendar<Date>;
  @ViewChild("calendar2", { static: false }) calendar2: MatCalendar<Date>;

  constructor(
    private menuS: MenuStatusService,
    private platform: Platform,
    private ui: UiService,
    private expService: ExperienciasService
  ) {
    platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.size = this.ui.getSizeType(platform.width());
      });
      this.size = this.ui.getSizeType(platform.width());
    });
  }

  ngOnInit() {
    this.expSubs = this.expService.exp$.subscribe((exps) => {
      if (exps && exps.length > 0) {
        this.exps = exps;
        this.fillCalendarExp();
      }
    });

    this.selectedDate = new Date();
    this.currentYear = this.selectedDate.getFullYear();
    this.minDate = this.selectedDate;
    if (this.countMonth1 >= 12) {
      this.minDate2 = new Date(this.currentYear + 1 + "/01/01");
    } else {
      this.minDate2 = new Date(
        this.currentYear + "/" + (this.countMonth1 + 1) + "/" + "01"
      );
    }

    this.expService.getData();

    this.onSelect(this.selectedDate);
    this.menuS.statusMenu("calendar");
  }

  ngOnDestroy(): void {
    this.expSubs.unsubscribe();
  }

  async fillCalendarExp() {
    const tmpL = this.events.length;
    this.events = [];
    for (const exp of this.exps) {
      let dateExp =
        exp.fechaExp.split("/")[1] +
        "/" +
        exp.fechaExp.split("/")[0] +
        "/" +
        exp.fechaExp.split("/")[2];

      let dateSt =
        exp.fechaAlt.split("/")[1] +
        "/" +
        exp.fechaAlt.split("/")[0] +
        "/" +
        exp.fechaAlt.split("/")[2];

      let fechaEnd = new Date(dateExp)
        .toLocaleDateString("es-ES", this.options)
        .split(" ");

      let fechaStart = new Date(dateSt)
        .toLocaleDateString("es-ES", this.options)
        .split(" ");

      this.events.push({
        start: dateSt,
        end: dateExp,
      });
      this.eventDay.push({
        start: fechaStart,
        end: fechaEnd,
      });
    }
    if (tmpL != this.events.length) {
      this.newEvents = false;
      this.showEvent = true;
      setTimeout(() => (this.newEvents = true), 50);
    }
  }

  onSelect(event) {
    this.showEvent = false;
    this.auxDate = event.toLocaleDateString();
    let stringDate2 = this.auxDate.split("/");
    this.stringCom =
      stringDate2[0] + "/" + stringDate2[1] + "/" + stringDate2[2];
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
        parseInt(dateValue[1]) >= parseInt(this.eventDay[j].start[1]) &&
        dateValue[3] == this.eventDay[j].start[3] &&
        parseInt(dateValue[5]) == parseInt(this.eventDay[j].start[5]) &&
        parseInt(dateValue[1]) <= parseInt(this.eventDay[j].end[1]) &&
        dateValue[3] == this.eventDay[j].end[3] &&
        parseInt(dateValue[5]) == parseInt(this.eventDay[j].end[5])
      ) {
        this.showEvent = true;
      }
    }
  }
  previousDate() {
    --this.countMonth1;
    this.countMonth2 = this.countMonth1 + 1;
    this.countYear2 = this.countYear1;
    if (this.countMonth1 < 1) {
      --this.countYear1;
      this.countMonth1 = 12;
    }
    if (this.countMonth2 < 1) {
      --this.countYear2;
      this.countMonth2 = 12;
    }

    this.setDates();
  }
  nextDate() {
    ++this.countMonth1;
    this.countMonth2 = this.countMonth1 + 1;
    this.countYear2 = this.countYear1;
    if (this.countMonth2 > 12) {
      this.countMonth2 = 1;
      ++this.countYear2;
    }
    if (this.countMonth1 > 12) {
      ++this.countYear1;
      this.countMonth1 = 1;
      this.countMonth2 = 2;
    }

    this.setDates();
  }

  setDates() {
    this.calendar1._goToDateInView(
      (this.minDate = new Date(this.countYear1 + "/" + this.countMonth1)),
      "month"
    );

    this.calendar2._goToDateInView(
      (this.minDate2 = new Date(this.countYear2 + "/" + this.countMonth2)),
      "month"
    );
  }

  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      const highlightDate1 = this.events
        .map((strDate, endDate) => new Date(strDate.start))
        .some(
          (d1) =>
            d1.getDate() <= date.getDate() &&
            d1.getMonth() == date.getMonth() &&
            d1.getFullYear() == date.getFullYear()
        );
      const highlightDate2 = this.events
        .map((endDate) => new Date(endDate.end))
        .some(
          (d2) =>
            d2.getDate() >= date.getDate() &&
            d2.getMonth() == date.getMonth() &&
            d2.getFullYear() == date.getFullYear()
        );
      return highlightDate1 && highlightDate2 ? "special-date" : "";
    };
  }

  showDate(dateS, dateE) {
    let daySel = this.stringCom.toString().split("/")[0];
    let monthSel = this.stringCom.toString().split("/")[1];
    let yearSel = this.stringCom.toString().split("/")[2];
    let dayS = dateS.split("/")[0];
    let monthS = dateS.split("/")[1];
    let yearS = dateS.split("/")[2];
    let dayE = dateE.split("/")[0];
    let monthE = dateE.split("/")[1];
    let yearE = dateE.split("/")[2];
    if (
      parseInt(daySel) >= parseInt(dayS) &&
      parseInt(monthSel) == parseInt(monthS) &&
      parseInt(yearSel) == parseInt(yearS) &&
      parseInt(daySel) <= parseInt(dayE) &&
      parseInt(monthSel) == parseInt(monthE) &&
      parseInt(yearSel) == parseInt(yearE)
    ) {
      return true;
    } else {
      return false;
    }
  }
}
