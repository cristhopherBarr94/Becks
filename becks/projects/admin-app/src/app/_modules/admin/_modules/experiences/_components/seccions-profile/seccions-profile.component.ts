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
  public  onEdit:boolean =  false;
  public Func1:any;
  public Func2:any;
  public Edit:any;

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
    this.Func1 = this.hideTabs.bind(this);
    this.Func2 = this.hideEdit.bind(this);
    this.Edit = this.editExp.bind(this);
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
  hideEdit() {
    this.onEdit = !this.onEdit;
  }
  editExp() {
    this.onEdit = !this.onEdit;
  }
}
