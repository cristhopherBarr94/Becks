import { Component, OnInit, Input } from "@angular/core";
import { environment } from "src/environments/environment";

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
  constructor() {}

  ngOnInit() {
    this.time = "?time_stamp=" + Math.floor(Date.now() / 1000);
    if (this.profile_view) {
      this.isPofile = "background-color-profile";
    }
  }
}
