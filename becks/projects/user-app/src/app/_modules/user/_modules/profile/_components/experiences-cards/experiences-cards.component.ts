import { Component, OnInit } from "@angular/core";
import { ExpCards } from "./mock-cards";

@Component({
  selector: "user-experiences-cards",
  templateUrl: "./experiences-cards.component.html",
  styleUrls: ["./experiences-cards.component.scss"],
})
export class ExperiencesCardsComponent implements OnInit {
  cards = ExpCards;

  constructor() {}

  ngOnInit() {}
}
