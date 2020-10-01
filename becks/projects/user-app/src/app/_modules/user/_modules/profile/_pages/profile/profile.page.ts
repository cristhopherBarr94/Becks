import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import { Subscription } from "rxjs";
import { User } from "src/app/_models/User";
import { UserService } from "src/app/_services/user.service";
import { NameTittleComponent } from "../../_components/name-tittle/name-tittle.component";
import { ProfilePictureComponent } from "../../_components/profile-picture/profile-picture.component";
import { StatisticsProfileComponent } from "../../_components/statistics-profile/statistics-profile.component";
import { Platform } from "@ionic/angular";
import { UiService } from "src/app/_services/ui.service";
import { Router } from "@angular/router";

@Component({
  selector: "user-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit, OnDestroy, AfterViewInit {
  public user = new User();
  public stats = "10";
  public size: string;
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
          console.log("ProfilePage -> ngOnInit -> user", user);
          this.user = user;
        }
      },
      (error: any) => {
        console.log("ProfilePage -> ngOnInit -> error", error);
      }
    );

    if (this.userSvc.getActualUser()) {
      this.user = this.userSvc.getActualUser();
    }
    this.userSvc.getData();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  ngAfterViewInit() {}

  editProfile() {
    this.router.navigate(["user/profile/edit"], {
      queryParamsHandling: "preserve",
    });
  }
}
