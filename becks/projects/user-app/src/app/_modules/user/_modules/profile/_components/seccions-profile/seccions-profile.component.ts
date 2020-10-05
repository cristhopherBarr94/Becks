import { Component, OnInit } from "@angular/core";
import { Platform } from "@ionic/angular";
import { UiService } from "src/app/_services/ui.service";

@Component({
  selector: "user-seccions-profile",
  templateUrl: "./seccions-profile.component.html",
  styleUrls: ["./seccions-profile.component.scss"],
})
export class SeccionsProfileComponent implements OnInit {
  public size: string;

  constructor(private platform: Platform, private ui: UiService) {
    platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.size = this.ui.getSizeType(platform.width());
      });
      this.size = this.ui.getSizeType(platform.width());
    });
  }

  ngOnInit() {}
}
