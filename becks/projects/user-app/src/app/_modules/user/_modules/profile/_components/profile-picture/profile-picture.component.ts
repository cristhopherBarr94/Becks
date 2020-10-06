import { Component, OnInit, Input } from "@angular/core";
import { UiService } from "src/app/_services/ui.service";
import { environment } from "src/environments/environment";
import { UpdateFileComponent } from "../update-file/update-file.component";

@Component({
  selector: "user-profile-picture",
  templateUrl: "./profile-picture.component.html",
  styleUrls: ["./profile-picture.component.scss"],
})
export class ProfilePictureComponent implements OnInit {
  @Input() urlImage: string;
  @Input() profile_name: string;
  @Input() profile_view: boolean;
  public time;
  public url: string = environment.serverUrl;
  public isPofile: string;
  constructor(private ui: UiService) {}

  ngOnInit() {
    this.time = "?time_stamp=" + Math.floor(Date.now() / 1000);
    if (this.profile_view) {
      this.isPofile = "background-color-profile";
    }
  }

  editPhot() {
    this.ui.showModal(
      UpdateFileComponent,
      "pop-up-profile-picture",
      true,
      true
    );
  }
}
