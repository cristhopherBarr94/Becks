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
import { RedemptionsService } from "src/app/_services/redemptions.service";
import { UiService } from "src/app/_services/ui.service";

@Component({
  selector: "user-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"],
})
export class ScheduleComponent implements OnInit, OnDestroy {
  public DayAndDate: string;
  public eventDay = [];
  public events = [];
  public exps = [];
  public options = {
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
  private redemps: number[] = [];
  private redempSubs: Subscription;
  public dropExp: boolean = true;
  public reserv: boolean = false;
  currentYear = new Date().getFullYear();
  @ViewChild("calendar1", { static: false }) calendar1: MatCalendar<Date>;
  @ViewChild("calendar2", { static: false }) calendar2: MatCalendar<Date>;

  constructor(
    private menuS: MenuStatusService,
    private platform: Platform,
    private ui: UiService,
    private expService: ExperienciasService,
    private redempSvc: RedemptionsService
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

    this.redempSubs = this.redempSvc.redemp$.subscribe(
      (red) => {
        this.ui.dismissLoading();
        this.redemps = red;
      },
      (e) => {
        this.ui.dismissLoading();
      }
    );

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
    this.redempSvc.getData();
  }

  ngOnDestroy(): void {
    this.expSubs.unsubscribe();
    this.redempSubs.unsubscribe();
  }

  async fillCalendarExp() {
    const tmpL = this.events.length;
    this.events = [];
    for (const exp of this.exps) {
      // create the final date to show exp
      let dateExp =
        exp.dateActTo.split("/")[1] +
        "/" +
        exp.dateActTo.split("/")[0] +
        "/" +
        exp.dateActTo.split("/")[2];
      // create the initial date to show exp
      let dateSt =
        exp.dateActFrom.split("/")[1] +
        "/" +
        exp.dateActFrom.split("/")[0] +
        "/" +
        exp.dateActFrom.split("/")[2];

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
      if(this.eventDay.length == 0 || this.events.length == 0){
      this.showEvent = false;
      }else{
        this.showEvent = true;
      }
    }
    if (tmpL != this.events.length) {
      this.newEvents = false;
      setTimeout(() => (this.newEvents = true), 50);
    }
  }
  // function to evaluate the current date selected and decide to if shown the message
  onSelect(event) {
    this.showEvent = false;
    this.stringCom = event;
    this.selectedDate = event;
    const dateString = this.selectedDate.toLocaleDateString(
      "es-ES",
      this.options
    );
    const dateValue = dateString.split(" ");
    this.currentYear = new Date().getFullYear();
    this.DayAndDate = dateValue[0] + " " + dateValue[3] + " " + dateValue[1];

    for (const exp of this.exps) {
      if (
        event.getTime() <=
          new Date(
            exp.dateActTo.split("/")[1] +
              "/" +
              exp.dateActTo.split("/")[0] +
              "/" +
              exp.dateActTo.split("/")[2]
          ).getTime() &&
        event.getTime() >=
          new Date(
            exp.dateActFrom.split("/")[1] +
              "/" +
              exp.dateActFrom.split("/")[0] +
              "/" +
              exp.dateActFrom.split("/")[2]
          ).getTime()
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
        .map((strDate) => new Date(strDate.start))
        .some((d1) => d1.getTime() <= date.getTime());
      const highlightDate2 = this.events
        .map((endDate) => new Date(endDate.end))
        .some((d2) => d2.getTime() >= date.getTime());
      return highlightDate1 && highlightDate2 ? "special-date" : "";
    };
  }

  showDate(dateS?, dateE?) {
    let todayDate = new Date(this.stringCom).toDateString();
    let dateSel = new Date(todayDate);

    let dateSs = new Date(
      dateS.split("/")[1] +
        "/" +
        dateS.split("/")[0] +
        "/" +
        dateS.split("/")[2]
    );
    let dateEs = new Date(
      dateE.split("/")[1] +
        "/" +
        dateE.split("/")[0] +
        "/" +
        dateE.split("/")[2]
    );
    if (
      dateSel.getTime() / 1000 >= new Date(dateSs).getTime() / 1000 &&
      dateSel.getTime() / 1000 <= new Date(dateEs).getTime() / 1000
    ) {
      return true;
    } else {
      return false;
    }
  }
  // add card border and button style
  // send reserv parameter for announcer amount
  showDataExperience(
    objetive: string,
    index: number,
    stk: any,
    sts: number,
    type: number
  ) {
    let classreturn = "";

    if (stk == "0" && sts == 0) {
      if (objetive == "border") {
        classreturn = "border-sold";
      } else {
        classreturn = "empty-exp becks-btn-sold";
      }
    } else if (sts == 0 && stk > 0 && type != 3) {
      if (objetive == "border") {
        classreturn = "border-normal";
      } else {
        classreturn = "normal-exp becks-btn-primary";
      }
    } else if (sts == 2) {
      if (objetive == "border") {
        classreturn = "border-soon";
      } else {
        classreturn = "soon-exp becks-btn-soon";
      }
    } else if (type == 3) {
      if (objetive == "border") {
        classreturn = "border-free";
      } else {
        classreturn = "normal-exp becks-btn-free";
      }
    }
    if (this.redemps) {
      this.reserv = false;
      for (let _id of this.redemps) {
        if (_id == this.exps[index].id) {
          this.reserv = true;
          if (objetive == "border") {
            classreturn = "border-reserved";
          } else {
            classreturn = "reserve-exp becks-btn-reserved";
          }
        }
      }
    }

    return classreturn;
  }

  //   classTransition() {
  //     let dropButton = document.querySelector("#drop");
  //     let bar = document.querySelector("#schBar");
  //     let container = document.querySelector("#shkCont");
  //     let calendar = document.querySelector("#calendar");
  //     this.dropExp = !this.dropExp;
  //     // open menu
  //     if (this.dropExp == false) {
  //       dropButton.setAttribute("style", "transform:rotate(180deg)");

  //       bar.setAttribute(
  //         "style",
  //         "height: 455px; overflow-y: auto; margin-top: 60px; transition:height 0.8s 0.4s; transform-origin: top;"
  //       );

  //       calendar.setAttribute(
  //         "style",
  //         " transform:translateY(-500px); opacity:0; max-height :0px ;transition: transform 0.8s 0.4s, max-height 0.8s 0.4s;"
  //       );

  //       container.setAttribute(
  //         "style",
  //         "transform:translateY(0px); transition:transform 0.8s 0.4s;"
  //       );
  //     } else {
  //       // closed menu
  //       dropButton.setAttribute("style", "transform:rotate(0deg)");

  //       bar.setAttribute("style", "height: 175px; overflow-y: hidden; ");

  //       calendar.setAttribute(
  //         "style",
  //         " max-height :auto; transform:translateY(0px); opacity:1; transition: transform 0.8s; 0.4s"
  //       );
  //       container.setAttribute(
  //         "style",
  //         "transform:translateY(0px); transition:transform 0.8s 0.4s;"
  //       );
  //     }
  //   }
}
