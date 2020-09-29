import { Component, OnInit } from "@angular/core";

@Component({
  selector: "user-experiences-cards",
  templateUrl: "./experiences-cards.component.html",
  styleUrls: ["./experiences-cards.component.scss"],
})
export class ExperiencesCardsComponent implements OnInit {
  cards = ExpCardsCancel;

  constructor() {}

  ngOnInit() {}
}

export interface CARD {
  nameExperience: string;
  type: string;
  urlImageExperience: string;
}

export const ExpCardsCancel: CARD[] = [
  {
    nameExperience: "dia de playa",
    type: "cancel",
    urlImageExperience:
      "https://www.kayak.com.co/news/wp-content/uploads/sites/180/2018/07/Playas-baratas-en-Mexico-Cover11.jpg",
  },
  {
    nameExperience: "dia de lluvia",
    type: "cancel",
    urlImageExperience:
      "https://scontent.fbog3-1.fna.fbcdn.net/v/t1.0-9/34199456_1932545923422817_3728020845444988928_n.jpg?_nc_cat=109&_nc_sid=85a577&_nc_ohc=3ncHLXVX0yEAX-d2SIV&_nc_ht=scontent.fbog3-1.fna&oh=13e31e95eb5dbc8dabcc00e20d25d68b&oe=5F9AAB71",
  },
];
