import { Component, OnInit } from "@angular/core";

@Component({
  selector: "user-tabs",
  templateUrl: "./tabs.component.html",
  styleUrls: ["./tabs.component.scss"],
})
export class TabsComponent implements OnInit {
  public actuallTab: string = "red";

  constructor() {}

  ngOnInit() {}

  selectedTab = (tab) => {
    if (tab.index == 0) {
      this.actuallTab = "blue";
    }
  };
}
