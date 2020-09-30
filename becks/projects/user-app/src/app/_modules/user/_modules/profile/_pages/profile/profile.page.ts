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
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "user-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(ProfilePictureComponent) picture: ProfilePictureComponent;
  @ViewChild(NameTittleComponent) name: NameTittleComponent;
  @ViewChild(StatisticsProfileComponent) statics: StatisticsProfileComponent;
  public size: string;

  public urlPicture: string =
    "https://upload.wikimedia.org/wikipedia/commons/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg";
  public first_name: string = "Mark";
  public profile_name: string = "Mark Zuckerberg";
  public last_name: string;
  public phone: number;

  statistics: string = "10";

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
        console.log("ProfilePage -> ngOnInit -> user1", user);
        if (user !== undefined) {
          console.log("ProfilePage -> ngOnInit -> user2", user);
          this.first_name = user.first_name;
          this.profile_name = user.first_name + " " + user.last_name;
        }
      },
      (error: any) => {}
    );
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.picture.urlImage = this.urlPicture;
    this.picture.profile_name = this.profile_name;
    this.first_name = this.first_name;
    this.statics.statistics = this.statistics;
  }

  editProfile() {
    this.router.navigate(["user/profile/edit"], {
      queryParamsHandling: "preserve",
    });
  }
}
