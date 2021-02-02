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
  @Input() profile_view: boolean;
  public time;
  public url: string = environment.serverUrl;
  public isProfile: string;
  public user;
  private pictureSub: Subscription;
  private userSub: Subscription;

  constructor(private ui: UiService, private userSvc: UserService) {
    this.user = userSvc.getActualUser();
  }

  ngOnInit() {
    if (this.profile_view) {
      this.isProfile = "background-color-profile";
    }

    this.pictureSub = this.userSvc.editing$.subscribe((isEditing) => {
      this.time = isEditing
        ? ""
        : "?time_stamp=" + Math.floor(Date.now() / 1000);
    });

    this.userSub = this.userSvc.user$.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.pictureSub.unsubscribe();
    this.userSub.unsubscribe();
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
    return this.url + this.user.photo + this.time;
  }
}
