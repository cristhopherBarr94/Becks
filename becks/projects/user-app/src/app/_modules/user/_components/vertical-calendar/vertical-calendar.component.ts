import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { ExperienciasService } from 'src/app/_services/experiencias.service';
import { MenuStatusService } from 'src/app/_services/menu-status.service';

@Component({
  selector: "user-vertical-calendar",
  templateUrl: "./vertical-calendar.component.html",
  styleUrls: ["./vertical-calendar.component.scss"],
})
export class VerticalCalendarComponent implements OnInit {
  public amount_exp: any = [];
  constructor(private menuS : MenuStatusService,
              private router: Router,
              private expService: ExperienciasService) {
    this.amount_exp = this.expService.getActualExps();
  }

  ngOnInit() {
    this.menuS.statusMenu("calendarmob");
  }
  
  redirectExpId(id) {
    this.router.navigate([`user/exp/${id}`], {
      queryParamsHandling: "preserve",
      state: { reload: 'true' }
    });
  }
}
