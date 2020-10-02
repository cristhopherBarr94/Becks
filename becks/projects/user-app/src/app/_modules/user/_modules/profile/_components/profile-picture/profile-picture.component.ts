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
  public url: string = environment.serverUrl;
  constructor() {}

  ngOnInit() {}
}
