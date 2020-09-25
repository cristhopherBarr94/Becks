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
    "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y";

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.picture.urlImage = this.urlPicture;
  }
}
