import { Component, Input, OnInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/User';
import { UserService } from 'src/app/_services/user.service';
import { MockExperiencias } from "../../../../../../_mocks/experiencias-mock";

@Component({
  selector: "user-experiences-cards",
  templateUrl: "./experiences-cards.component.html",
  styleUrls: ["./experiences-cards.component.scss"],
})
export class ExperiencesCardsComponent implements OnInit {
  @Input() vertical: boolean;
  public user = new User();
  public direcionCards: string;
  public isActive:boolean;
  cancelCards = new Array();
  pendingCards = new Array();
  acceptCards = new Array();

  userSubscription: Subscription;

  constructor(
    private userSvc: UserService,
  ) {}

  ngOnInit() {
    this.userSubscription = this.userSvc.user$.subscribe(
      (user: User) => {
        if (user !== undefined) {       
          this.isActive = user.activate;
        }
      },
      (error: any) => {}
    );

    if (this.vertical) {
      this.direcionCards = "flex-direction-row";
    }
    
    for (let i = 0; i < MockExperiencias.length; i++) {
      if (MockExperiencias[i].status == "0") {
        this.acceptCards.push(MockExperiencias[i]);
      }
      if (MockExperiencias[i].status == "1") {
        this.pendingCards.push(MockExperiencias[i]);
      }
      if (MockExperiencias[i].status == "2") {
        this.cancelCards.push(MockExperiencias[i]);
      }
    }
  }
}
