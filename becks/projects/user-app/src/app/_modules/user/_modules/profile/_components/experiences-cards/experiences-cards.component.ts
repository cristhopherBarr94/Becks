import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { Subscription } from "rxjs";
import { Exp } from "src/app/_models/exp";
import { User } from "src/app/_models/User";
import { ExperienciasService } from "src/app/_services/experiencias.service";
import { RedemptionsService } from "src/app/_services/redemptions.service";
import { UiService } from "src/app/_services/ui.service";
import { UserService } from "src/app/_services/user.service";

@Component({
  selector: "user-experiences-cards",
  templateUrl: "./experiences-cards.component.html",
  styleUrls: ["./experiences-cards.component.scss"],
})
export class ExperiencesCardsComponent implements OnInit, OnDestroy {
  @Input() vertical: boolean;
  public user = new User();
  public direcionCards: string;
  public isActive: boolean;
  public size: string;

  cancelCards = new Array();
  pendingCards = new Array();
  acceptCards = new Array();

  userCodeSubscription: Subscription;
  expSubscription: Subscription;
  redempSubs: Subscription;

  experiences: Exp[];
  redemptions: Number[];

  constructor(
    private platform: Platform,
    private userSvc: UserService,
    private expService: ExperienciasService,
    private redempSvc: RedemptionsService,
    private ui: UiService,
    private router: Router
  ) {
    platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.size = this.ui.getSizeType(platform.width());
      });
      this.size = this.ui.getSizeType(platform.width());
    });
  }

  ngOnInit() {
    this.userCodeSubscription = this.userSvc.userCodes$.subscribe((codes) => {
      if (codes && codes.length > 0) {
        this.isActive = true;
      }
    });

    this.expSubscription = this.expService.exp$.subscribe((exps) => {
      this.experiences = exps;
      this.buildCards();
    });

    this.redempSubs = this.redempSvc.redemp$.subscribe((red) => {
      this.redemptions = red;
      this.buildCards();
    });
    this.redempSvc.getData();

    if (this.vertical) {
      this.direcionCards = "flex-direction-row";
    }

    this.experiences = this.expService.getActualExps();
    if (this.experiences && this.experiences.length > 0) {
      this.buildCards();
    }
    this.expService.getData();
    this.userSvc.getCodes();
  }

  ngOnDestroy(): void {
    this.userCodeSubscription.unsubscribe();
    this.redempSubs.unsubscribe();
    this.expSubscription.unsubscribe();
  }

  buildCards() {
    if (this.experiences && this.redemptions) {
      this.acceptCards = [];
      this.pendingCards = [];

      for (let i = 0; i < this.experiences.length; i++) {
        if (
          this.redemptions.indexOf(parseInt(this.experiences[i].id + "")) > -1
        ) {
          if (this.experiences[i].status == "0") {
            this.acceptCards.push(this.experiences[i]);
          }
          if (
            this.experiences[i].status == "1" ||
            this.experiences[i].status == "2"
          ) {
            this.pendingCards.push(this.experiences[i]);
          }
        }
      }
    }
  }

  redirectExp() {
    this.router.navigate(["user/exp"], {
      queryParamsHandling: "preserve",
      state: { reload: "true" },
    });
  }
}
