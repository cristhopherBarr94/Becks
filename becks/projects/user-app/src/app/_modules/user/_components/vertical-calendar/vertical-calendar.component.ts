import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExperienciasService } from 'src/app/_services/experiencias.service';
import { MenuStatusService } from 'src/app/_services/menu-status.service';

@Component({
  selector: "user-vertical-calendar",
  templateUrl: "./vertical-calendar.component.html",
  styleUrls: ["./vertical-calendar.component.scss"],
})
export class VerticalCalendarComponent implements OnInit, OnDestroy {
  public amount_exp: any = [];
  private expSubs: Subscription;

  constructor(private menuS : MenuStatusService,
              private router: Router,
              private expService: ExperienciasService) {
    this.amount_exp = this.expService.getActualExps();
    this.expSubs = this.expService.exp$.subscribe(exps => {
      if ( exps && exps.length > 0 ) {
        this.amount_exp = exps;
      }
    });
    this.expService.getData();

  }

  ngOnInit() {
    this.menuS.statusMenu("calendarmob");
  }
  ngOnDestroy(): void {
    this.expSubs.unsubscribe();
  }

  redirectExpId(id) {
    this.router.navigate([`user/exp/${id}`], {
      queryParamsHandling: "preserve",
      state: { reload: 'true' }
    });
  }
}
