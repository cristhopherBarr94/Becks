import { Component, Input, OnInit } from "@angular/core";
import { MockExperiencias } from "../../../../../../_mocks/experiencias-mock";

@Component({
  selector: "user-experiences-cards",
  templateUrl: "./experiences-cards.component.html",
  styleUrls: ["./experiences-cards.component.scss"],
})
export class ExperiencesCardsComponent implements OnInit {
  @Input() vertical: boolean;
  public direcionCards: string;
  cancelCards = new Array();
  pendingCards = new Array();
  acceptCards = new Array();

  constructor() {}

  ngOnInit() {
    if (this.vertical) {
      this.direcionCards = "flex-direction-row";
    }
    for (let i = 0; i < MockExperiencias.length; i++) {
      if (MockExperiencias[i].status == "0") {
        this.acceptCards.push(MockExperiencias[i]);
      }
      if (MockExperiencias[i].status == "1") {
        this.pendingCards.push(MockExperiencias[i]);
      }
      if (MockExperiencias[i].status == "2") {
        this.cancelCards.push(MockExperiencias[i]);
      }
    }
  }
}
