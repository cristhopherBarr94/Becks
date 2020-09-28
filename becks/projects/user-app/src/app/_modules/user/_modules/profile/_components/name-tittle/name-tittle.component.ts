import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "user-name-tittle",
  templateUrl: "./name-tittle.component.html",
  styleUrls: ["./name-tittle.component.scss"],
})
export class NameTittleComponent implements OnInit {
  @Input() first_name: string;
  constructor() {}

  ngOnInit() {}
}
