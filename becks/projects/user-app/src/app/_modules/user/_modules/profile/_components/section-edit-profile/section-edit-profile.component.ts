import {  Component,  OnInit } from "@angular/core";
import {
  FormGroup,
} from "@angular/forms";
import { Router } from "@angular/router";
import { UiService } from "src/app/_services/ui.service";
import { Subscription } from "rxjs";
import { User } from "src/app/_models/User";
import { Platform } from "@ionic/angular";
import { UpdateFileComponent } from "../update-file/update-file.component";

@Component({
  selector: "user-section-edit-profile",
  templateUrl: "./section-edit-profile.component.html",
  styleUrls: ["./section-edit-profile.component.scss"],
})
export class SectionEditProfileComponent implements OnInit {
  public birthDayDate: any;
  public chargePhoto: boolean = false;
  public size: string;

  constructor(
    private router: Router,
    private ui: UiService,
    private platform: Platform
  ) {
    platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.size = this.ui.getSizeType(platform.width());
      });
      this.size = this.ui.getSizeType(platform.width());
    });
  }

  ngOnInit() {}

 
  closeEdit() {
    this.chargePhoto = false;
    this.router.navigate(["user/profile"], {
      queryParamsHandling: "preserve",
    });
  }
 

  changePhoto() {
    this.chargePhoto = !this.chargePhoto;
    this.ui.showModal(
      UpdateFileComponent,
      "pop-up-profile-picture",
      true,
      true
    );
  }

  closeEditDesktop() {
    this.ui.dismissModal();
  }

  screnSize(size: string, reverse: boolean) {
    if (size != "xs") {
      if (reverse) {
        return "flex-direction-row-reverse";
      }
      return "flex-direction-row";
    } else {
      return "flex-direction-column";
    }
  }
}
