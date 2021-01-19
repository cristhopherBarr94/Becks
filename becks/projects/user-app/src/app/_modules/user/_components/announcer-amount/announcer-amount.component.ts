import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "user-announcer-amount",
  templateUrl: "./announcer-amount.component.html",
  styleUrls: ["./announcer-amount.component.scss"],
})
export class AnnouncerAmountComponent implements OnInit {
  @Input() stock: number;
  @Input() status: any;
  @Input() type: number;
  constructor() {}

  ngOnInit() {}
}
