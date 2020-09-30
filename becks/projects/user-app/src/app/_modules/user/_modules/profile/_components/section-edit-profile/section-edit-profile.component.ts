import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ProfilePictureComponent } from "../profile-picture/profile-picture.component";

@Component({
  selector: "user-section-edit-profile",
  templateUrl: "./section-edit-profile.component.html",
  styleUrls: ["./section-edit-profile.component.scss"],
})
export class SectionEditProfileComponent implements OnInit, AfterViewInit {
  @ViewChild(ProfilePictureComponent) picture: ProfilePictureComponent;
  public dataProfile: any;
  public urlPicture: string;

  constructor(private router: Router) {}

  ngOnInit() {
    this.dataProfile = localStorage.getItem("userData");
    this.urlPicture = this.dataProfile.urlPicture;
    console.log(
      "SectionEditProfileComponent -> ngOnInit -> this.dataProfile",
      this.dataProfile
    );
  }

  ngAfterViewInit() {
    this.picture.urlImage = this.urlPicture;
  }

  closeEdit() {
    this.router.navigate(["user/profile"], {
      queryParamsHandling: "preserve",
    });
  }
}
