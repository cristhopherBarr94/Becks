import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/User';
import { UserService } from 'src/app/_services/user.service';
import { MockExperiencias } from "../../../../../../_mocks/experiencias-mock";

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

  constructor(
    private userSvc: UserService,
  ) {}

  ngOnInit() {
    this.userCodeSubscription = this.userSvc.userCodes$.subscribe(codes =>{
      if(codes && codes.length>0){
        this.isActive = true;
      }
    });

    if (this.vertical) {
      this.direcionCards = "flex-direction-row";
    }

    for (let i = 0; i < MockExperiencias.length; i++) {
      if (MockExperiencias[i].status == "0") {
        this.acceptCards.push(MockExperiencias[i]);
      }
      if (MockExperiencias[i].status == "1" || MockExperiencias[i].status == "2") {
        this.pendingCards.push(MockExperiencias[i]);
      }
      // if (MockExperiencias[i].status == "2") {
      //   this.cancelCards.push(MockExperiencias[i]);
      // }
    }
    this.userSvc.getCodes();
  }
  ngOnDestroy(): void {
    this.userCodeSubscription.unsubscribe();
  }
}
