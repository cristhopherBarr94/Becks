import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import { Subscription } from "rxjs";
import { UiService } from "src/app/_services/ui.service";
import { UserService } from "src/app/_services/user.service";
import { environment } from "src/environments/environment";
import { UpdateFileComponent } from "../update-file/update-file.component";

@Component({
  selector: "user-profile-picture",
  templateUrl: "./profile-picture.component.html",
  styleUrls: ["./profile-picture.component.scss"],
})
export class ProfilePictureComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() urlImage: string;
  @Input() profile_name: string;
  @Input() profile_view: boolean;
  @Input() default_photo: boolean;
  public time;
  public url: string = environment.serverUrl;
  public isPofile: string;
  private pictureSub: Subscription;

  constructor(private ui: UiService, private userSvc: UserService) {
    this.pictureSub = this.userSvc.editing$.subscribe((isEditing) => {
      console.log("constructor -> isEditing", isEditing);
      this.time = isEditing
        ? ""
        : "?time_stamp=" + Math.floor(Date.now() / 1000);
    });
  }

  ngOnInit() {
    if (this.profile_view) {
      this.isPofile = "background-color-profile";
    }
  }

  ngOnDestroy() {
    this.pictureSub.unsubscribe();
  }

  ngAfterViewInit() {
    this.time = "?time_stamp=" + Math.floor(Date.now() / 1000);
  }

  editPhot() {
    this.ui.showModal(
      UpdateFileComponent,
      "pop-up-profile-picture",
      true,
      true
    );
  }

  profilePicture() {
    console.log("profilePicture -> this.default_photo", {
      default: this.default_photo,
      url: this.urlImage,
    });
    return this.default_photo
      ? this.urlImage
      : this.url + this.urlImage + this.time;
  }
}
