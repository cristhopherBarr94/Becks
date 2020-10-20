import { Component, OnInit } from "@angular/core";
import { MockExperiencias } from 'src/app/_mocks/experiencias-mock';
import { MenuStatusService } from 'src/app/_services/menu-status.service';

@Component({
  selector: "user-vertical-calendar",
  templateUrl: "./vertical-calendar.component.html",
  styleUrls: ["./vertical-calendar.component.scss"],
})
export class VerticalCalendarComponent implements OnInit {
  public amount_exp: any = MockExperiencias;
  constructor(private menuS : MenuStatusService) {}

  ngOnInit() {this.menuS.statusMenu("calendarmob");
  console.log(this.amount_exp);
}
}
