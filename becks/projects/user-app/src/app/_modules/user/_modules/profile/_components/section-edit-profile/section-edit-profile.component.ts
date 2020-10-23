import {  Component,  EventEmitter,  OnDestroy,  OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { UiService } from "src/app/_services/ui.service";
import { Platform } from "@ionic/angular";
import { UpdateFileComponent } from "../update-file/update-file.component";
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/User';

@Component({
  selector: "user-section-edit-profile",
  templateUrl: "./section-edit-profile.component.html",
  styleUrls: ["./section-edit-profile.component.scss"],
})
export class SectionEditProfileComponent implements OnInit, OnDestroy {
  @Output() indexTab = new EventEmitter();
  public user = new User();
  public chargePhoto: boolean = false;
  public size: string;
  userSubscription: Subscription;

  constructor(
    private router: Router,
    private ui: UiService,
    private platform: Platform,
    private userSvc: UserService,
  ) {
    platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.size = this.ui.getSizeType(platform.width());
      });
      this.size = this.ui.getSizeType(platform.width());
    });
  }

  ngOnInit() {
    this.userSubscription = this.userSvc.user$.subscribe(
      (user) => {
        if ( user ) {
          this.user =  user;          
        }
      }
    );
    if (this.userSvc.getActualUser()) {
      this.user = this.userSvc.getActualUser();     
    } 
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

 
  closeEdit() {
    this.chargePhoto = false;
    this.router.navigate(["user/profile"], {
      queryParamsHandling: "preserve",
    });
  }
 

  changePhoto() {
    this.chargePhoto = !this.chargePhoto;
    this.ui.showModal(
      UpdateFileComponent,
      "pop-up-profile-picture",
      true,
      true
    );
  }

  closeEditDesktop() {
    this.ui.dismissModal();
  }

  screnSize(size: string, reverse: boolean) {
    if (size != "xs") {
      if (reverse) {
        return "flex-direction-row-reverse";
      }
      return "flex-direction-row";
    } else {
      return "flex-direction-column";
    }
  }

  selectedTab = (tab) => {
    this.indexTab.emit(tab.index);
  };

  saveChanges(){
    
  }
}
