import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ExperienciasService } from "src/app/_services/experiencias.service";
import { MenuStatusService } from "src/app/_services/menu-status.service";
import { RedemptionsService } from "src/app/_services/redemptions.service";

@Component({
  selector: "user-vertical-calendar",
  templateUrl: "./vertical-calendar.component.html",
  styleUrls: ["./vertical-calendar.component.scss"],
})
export class VerticalCalendarComponent implements OnInit, OnDestroy {
  public amount_exp: any = [];
  private expSubs: Subscription;
  private redemps: number[] = [];
  private redempSubs: Subscription;

  constructor(
    private menuS: MenuStatusService,
    private router: Router,
    private expService: ExperienciasService,
    private redempSvc: RedemptionsService
  ) {
    this.amount_exp = this.expService.getActualExps();
    this.expSubs = this.expService.exp$.subscribe((exps) => {
      if (exps && exps.length > 0) {
        this.amount_exp = exps;
      }
    });
    this.expService.getData();
  }

  ngOnInit() {
    this.menuS.statusMenu("calendarmob");
    this.redempSubs = this.redempSvc.redemp$.subscribe(
      (red) => {
        this.redemps = red;
      },
      (e) => {}
    );
  }
  ngOnDestroy(): void {
    this.expSubs.unsubscribe();
    this.redempSubs.unsubscribe();
  }

  redirectExpId(id) {
    this.router.navigate([`user/exp/${id}`], {
      queryParamsHandling: "preserve",
      state: { reload: "true" },
    });
  }

  showDataExperience(eid: number, stk: any, sts: number) {
    let classreturn = "";
    if (stk == "0" && sts == 0) {
      classreturn = "empty-exp";
    } else if (sts == 0 && stk > 0) {
      classreturn = "normal-exp";
    } else if (sts == 2) {
      classreturn = "soon-exp";
    }
    if (this.redemps) {
      for (let _id of this.redemps) {
        if (_id == eid) {
          classreturn = "reserve-exp";
        }
      }
    }
    return classreturn;
  }
}
