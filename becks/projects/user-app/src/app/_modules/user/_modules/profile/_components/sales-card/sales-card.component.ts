import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "user-sales-card",
  templateUrl: "./sales-card.component.html",
  styleUrls: ["./sales-card.component.scss"],
})
export class SalesCardComponent implements OnInit {
  @Input() urlImageSales: string;
  constructor() {}

  ngOnInit() {
    // console.log(this.urlImageSales);
  }
}
