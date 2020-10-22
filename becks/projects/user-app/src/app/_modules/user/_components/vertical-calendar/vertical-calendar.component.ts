import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { MockExperiencias } from 'src/app/_mocks/experiencias-mock';
import { MenuStatusService } from 'src/app/_services/menu-status.service';

@Component({
  selector: "user-vertical-calendar",
  templateUrl: "./vertical-calendar.component.html",
  styleUrls: ["./vertical-calendar.component.scss"],
})
export class VerticalCalendarComponent implements OnInit {
  public amount_exp: any = MockExperiencias;
  constructor(private menuS : MenuStatusService,
              private router: Router) {}

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
