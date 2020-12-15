import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "user-statistics-profile",
  templateUrl: "./statistics-profile.component.html",
  styleUrls: ["./statistics-profile.component.scss"],
})
export class StatisticsProfileComponent implements OnInit {
  @Input() statistics: any;

  constructor() {}

  ngOnInit() {}
}
