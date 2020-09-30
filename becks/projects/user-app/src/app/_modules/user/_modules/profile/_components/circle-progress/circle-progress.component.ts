import { Component, OnInit } from "@angular/core";

@Component({
  selector: "user-circle-progress",
  templateUrl: "./circle-progress.component.html",
  styleUrls: ["./circle-progress.component.scss"],
})
export class CircleProgressComponent implements OnInit {
  remaining_days: any;
  colorProgress: string;
  colorProgressBar: string;
  progress: number = 25 * (10 / 3);
  subtitle: string = "Días";
  constructor() {}

  ngOnInit() {
    this.remaining_days = Math.ceil(this.progress * (30 / 100));
    if (this.progress <= 25) {
      this.colorProgress = "#FF7A00";
      this.colorProgressBar =
        "linear-gradient(180deg, #E66E48 0%, #FF7A00 100%)";
    } else if (this.progress > 25 && this.progress <= 50) {
      this.colorProgress = "#FF7A00";
      this.colorProgressBar =
        "linear-gradient(180deg, #E66E48 0%, #FF7A00 100%)";
    } else if (this.progress > 50 && this.progress <= 75) {
      this.colorProgress = "#00B379";
      this.colorProgressBar =
        "linear-gradient(180deg, #038259 0%, #00B379 100%)";
    } else if (this.progress > 75) {
      this.colorProgress = "#038259";
      this.colorProgressBar =
        "linear-gradient(180deg, #038259 0%, #00B379 100%)";
    }
    if (this.progress < 0) {
      this.progress = 0;
    }
  }
}
