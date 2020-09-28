import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "user-experiences-card",
  templateUrl: "./experiences-card.component.html",
  styleUrls: ["./experiences-card.component.scss"],
})
export class ExperiencesCardComponent implements OnInit {
  @Input() urlImageExperience: string;
  @Input() nameExperience: string;

  constructor() {}

  ngOnInit() {}
}
