import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { Subscription } from "rxjs";
import { ExperienciasService } from "src/app/_services/experiencias.service";
import { RedemptionsService } from "src/app/_services/redemptions.service";
import { UiService } from "src/app/_services/ui.service";
import { Exp } from "src/app/_models/exp";

@Component({
  selector: "user-seccions-profile",
  templateUrl: "./seccions-profile.component.html",
  styleUrls: ["./seccions-profile.component.scss"],
})
export class SeccionsProfileComponent implements OnInit, OnDestroy {
  expSubscription: Subscription;
  redempSubs: Subscription;
  public size: string;
  public experiences: any[] = [];
  public redemptions: any[] = [];
  public showMessagge: boolean = true;

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

  ngOnInit() {
    this.expSubscription = this.expService.exp$.subscribe((exps) => {
      this.experiences = exps;
      this.redempSubs = this.redempSvc.redemp$.subscribe((red) => {
        this.redemptions = red;
      });

      for (let i = 0; i < this.experiences.length; i++) {
        for (let j = 0; j < this.redemptions.length; j++) {
          if (this.experiences[i].id == this.redemptions[j]) {
            this.showMessagge = false;
          }
        }
      }
    });

    this.redempSvc.getData();
    this.expService.getData();
  }

  ngOnDestroy(): void {
    this.redempSubs.unsubscribe();
    this.expSubscription.unsubscribe();
  }

  redirectExp() {
    this.router.navigate(["user/exp"], {
      queryParamsHandling: "preserve",
      state: { reload: "true" },
    });
  }
}
