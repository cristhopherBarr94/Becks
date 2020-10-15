import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { User } from "src/app/_models/User";
import { UserService } from "src/app/_services/user.service";
import { Platform } from "@ionic/angular";
import { UiService } from "src/app/_services/ui.service";
import { Router } from "@angular/router";
import { SectionEditProfileComponent } from "../../_components/section-edit-profile/section-edit-profile.component";

@Component({
  selector: "user-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit, OnDestroy {
  public user = new User();
  public stats = { buy: "10", exp: "6", friends: "7" };
  public size: string;
  public default_picure: boolean;
  public headerPosition : string

  userSubscription: Subscription;

  constructor(
    private userSvc: UserService,
    private platform: Platform,
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
    this.userSubscription = this.userSvc.user$.subscribe(
      (user: User) => {
        if (user !== undefined) {
          if (user.status == 1) {
            this.router.navigate(["user/changePass"], {
              queryParamsHandling: "preserve",
            });
          }
          this.user = user;
        }
      },
      (error: any) => {}
    );

    if (this.userSvc.getActualUser()) {
      this.user = this.userSvc.getActualUser();
    }
    this.userSvc.getData();
    this.ui.dismissLoading();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  editProfile() {
    this.router.navigate(["user/profile/edit"], {
      queryParamsHandling: "preserve",
    });
  }

  editProfileDesktop() {
    this.ui.showModal(
      SectionEditProfileComponent,
      "modal-edit-profile",
      true,
      true
    );
  }

  profilePicture() {
    this.default_picure = !!!this.user.photo;
    return !!this.user.photo
      ? this.user.photo
      : this.user.gender == "F"
      ? "../../../../../../../assets/img/profile_female.jpg"
      : "../../../../../../../assets/img/profile_male.jpg";
  }

  positionHeader(){
    if(this.size == 'xs'){
      return 'positionAbsolute'
    }
    else{
      return 'positionRelative'
    }
  }
}
