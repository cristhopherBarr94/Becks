import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { Subscription } from "rxjs";
import { ExperienciasService } from "src/app/_services/experiencias.service";
import { RedemptionsService } from "src/app/_services/redemptions.service";
import { UiService } from "src/app/_services/ui.service";

@Component({
  selector: "user-seccions-profile",
  templateUrl: "./seccions-profile.component.html",
  styleUrls: ["./seccions-profile.component.scss"],
})
export class SeccionsProfileComponent implements OnInit {
  expSubscription: Subscription;
  redempSubs: Subscription;
  public size: string;

  @Input() isActive: boolean;

  constructor(
    private platform: Platform,
    private ui: UiService,
    private router: Router,
    private redempSvc: RedemptionsService,
    private expService: ExperienciasService
  ) {
    platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.size = this.ui.getSizeType(platform.width());
      });
      this.size = this.ui.getSizeType(platform.width());
    });
  }

  ngOnInit() {}
}
