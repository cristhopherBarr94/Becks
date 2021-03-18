import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
// import { ExperienciasService } from "src/app/_services/experiencias.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Platform } from "@ionic/angular";
import { UiService } from "src/app/_services/ui.service";
import { FilesService } from "src/app/_services/files.service";
@Component({
  selector: "app-terms-conditions",
  templateUrl: "./terms-conditions.page.html",
  styleUrls: ["./terms-conditions.page.scss"],
})
export class TermsConditionsPage implements OnInit {
  private expSubs: Subscription;
  public terms_exp = [];
  public fousedTab = 2;
  public saveUrl: any[] = [];
  public isBordered: boolean = true;
  public campains: boolean = true;
  public size: string;

  constructor(
    private filesService: FilesService,
    private sanitizer: DomSanitizer,
    private platform: Platform,
    private ui: UiService
  ) {
    platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.size = this.ui.getSizeType(platform.width());
      });
      this.size = this.ui.getSizeType(platform.width());
    });

    this.expSubs = this.filesService.expFiles$.subscribe((exps) => {

      if (exps && exps.length > 0) {
        this.terms_exp = exps;
      }
      exps.forEach((e) => {
        let dangerousUrl =
          e.file+"#toolbar=0&navpanes=0&scrollbar=0&#view=fitv&embedded=true";
        this.saveUrl.push(
          this.sanitizer.bypassSecurityTrustResourceUrl(dangerousUrl)
        );
      });
    });
    this.filesService.getDataFiles();
  }

  ngOnInit() {
    this.fousedTab = 0;
  }
  ngOnDestroy(): void {
    this.expSubs.unsubscribe();
  }

  selectedTab (tab)  {
    if (this.size == "md" || this.size == "lg") {
      let inkBar = document.querySelector(".mat-ink-bar");
      let verticalPs = 50;
      if (tab === 0) {
        verticalPs = 50;
      } else if (tab === 1) {
        verticalPs = 125;
      } else if (tab === 2) {
        verticalPs = 200;
      } else if (tab === 3) {
        verticalPs = 275;
      }
      inkBar.setAttribute("style", "top:" + verticalPs + "px !important; width: 160px;");
    }
  };
}
