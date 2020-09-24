import { Component, OnInit } from "@angular/core";

@Component({
  selector: "user-tabs",
  templateUrl: "./tabs.component.html",
  styleUrls: ["./tabs.component.scss"],
})
export class TabsComponent implements OnInit {
  public actuallTab: number = 0;

  constructor() {}

  ngOnInit() {}

  selectedTab = (tab) => {
    this.actuallTab = tab.index;
  };
}
