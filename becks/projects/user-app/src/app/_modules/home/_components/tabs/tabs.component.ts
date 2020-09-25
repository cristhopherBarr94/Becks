import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "user-tabs",
  templateUrl: "./tabs.component.html",
  styleUrls: ["./tabs.component.scss"],
})
export class TabsComponent implements OnInit {
  public actuallTab: string = "red";
  @Output() indexTab = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  selectedTab = (tab) => {
    this.indexTab.emit(tab.index);
  };
}
