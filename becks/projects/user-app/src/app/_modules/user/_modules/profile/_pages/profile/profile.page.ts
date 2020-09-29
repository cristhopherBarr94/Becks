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

@Component({
  selector: "user-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(ProfilePictureComponent) picture: ProfilePictureComponent;
  @ViewChild(NameTittleComponent) name: NameTittleComponent;
  @ViewChild(StatisticsProfileComponent) statics: StatisticsProfileComponent;

  urlPicture: string =
    "https://upload.wikimedia.org/wikipedia/commons/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg";
  first_name: string = "Mark";
  profile_name: string = "Mark Zuckerberg";

  statistics: string = "10";

  userSubscription: Subscription;

  constructor(private userSvc: UserService) {}

  ngOnInit() {
    this.userSubscription = this.userSvc.user$.subscribe(
      (user: User) => {
        this.first_name = user.first_name;
        this.profile_name = user.first_name + " " + user.last_name;
        this.urlPicture = user.photo;
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
    this.name.first_name = this.first_name;
    this.statics.statistics = this.statistics;
  }
}
