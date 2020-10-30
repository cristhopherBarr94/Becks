import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/User';
import { ExperienciasService } from 'src/app/_services/experiencias.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: "user-experiences-cards",
  templateUrl: "./experiences-cards.component.html",
  styleUrls: ["./experiences-cards.component.scss"],
})
export class ExperiencesCardsComponent implements OnInit, OnDestroy {
  @Input() vertical: boolean;
  public user = new User();
  public direcionCards: string;
  public isActive:boolean;
  cancelCards = new Array();
  pendingCards = new Array();
  acceptCards = new Array();

  userCodeSubscription: Subscription;
  expSubscription: Subscription;

  constructor(
    private userSvc: UserService,
    private expService: ExperienciasService
  ) {}

  ngOnInit() {
    this.userCodeSubscription = this.userSvc.userCodes$.subscribe(codes =>{
      if(codes && codes.length>0){
        this.isActive = true;
      }
    });

    this.expSubscription = this.expService.exp$.subscribe( exps => {
      this.buildCards(exps);
    });

    if (this.vertical) {
      this.direcionCards = "flex-direction-row";
    }

    const exps = this.expService.getActualExps();
    if ( exps && exps.length > 0 ) {
      this.buildCards(exps);
    }
    this.expService.getData();
    this.userSvc.getCodes();
  }

  ngOnDestroy(): void {
    this.userCodeSubscription.unsubscribe();
  }

  buildCards(exps) {
    this.acceptCards = [];
    this.pendingCards = [];

    for (let i = 0; i < exps.length; i++) {
      if (exps[i].status == "0") {
        this.acceptCards.push(exps[i]);
      }
      if (exps[i].status == "1" || exps[i].status == "2") {
        this.pendingCards.push(exps[i]);
      }
    }
  }
}
