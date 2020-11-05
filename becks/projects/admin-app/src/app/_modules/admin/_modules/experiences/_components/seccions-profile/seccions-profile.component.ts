import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { UiService } from "src/app/_services/ui.service";

@Component({
  selector: "user-seccions-profile",
  templateUrl: "./seccions-profile.component.html",
  styleUrls: ["./seccions-profile.component.scss"],
})
export class SeccionsProfileComponent implements OnInit {
  public size: string;
  @Input() isActive : boolean
  public  create:boolean =  false;

  constructor(
    private platform: Platform,
    private ui: UiService,
    private router: Router
  ) {
    platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.size = this.ui.getSizeType(platform.width());
      });
      this.size = this.ui.getSizeType(platform.width());
    });
  }

  ngOnInit() { 
    // console.log("SeccionsProfileComponent -> isActive", this.isActive)
  }

  redirectExp() {
    this.router.navigate(["user/exp"], {
      queryParamsHandling: "preserve",
      state: { reload: 'true' }
    });
  }

  hideTabs() {
    this.create = !this.create;
  }
}
