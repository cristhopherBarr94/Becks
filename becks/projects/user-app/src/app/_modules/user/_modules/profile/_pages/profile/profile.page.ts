import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { ProfilePictureComponent } from "../../_components/profile-picture/profile-picture.component";

@Component({
  selector: "user-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit, AfterViewInit {
  @ViewChild(ProfilePictureComponent) picture: ProfilePictureComponent;
  urlPicture: string =
    "https://upload.wikimedia.org/wikipedia/commons/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg";

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.picture.urlImage = this.urlPicture;
  }
}
