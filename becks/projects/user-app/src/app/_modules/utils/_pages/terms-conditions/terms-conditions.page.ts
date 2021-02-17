import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ExperienciasService } from "src/app/_services/experiencias.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Platform } from "@ionic/angular";
import { UiService } from "src/app/_services/ui.service";
@Component({
  selector: "app-terms-conditions",
  templateUrl: "./terms-conditions.page.html",
  styleUrls: ["./terms-conditions.page.scss"],
})
export class TermsConditionsPage implements OnInit {
  private expSubs: Subscription;
  public terms_exp = [];
  public globalUrl: string =
    "https://becks.flexitco.co/becks-back/sites/default/files/pdfs/experience/";
  public saveUrl: any[] = [];
  public isBordered: boolean = true;
  public campains: boolean = true;
  public size: string;

  constructor(
    private expService: ExperienciasService,
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

    this.expSubs = this.expService.exp$.subscribe((exps) => {
      if (exps && exps.length > 0) {
        this.terms_exp = exps;
      }
      exps.forEach((e) => {
        let dangerousUrl =
          this.globalUrl +
          e.id +
          ".pdf#toolbar=0&navpanes=0&scrollbar=0&#view=fitv";
        this.saveUrl.push(
          this.sanitizer.bypassSecurityTrustResourceUrl(dangerousUrl)
        );
      });
    });
    this.expService.getData();
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    this.expSubs.unsubscribe();
  }

  selectedTab = (tab) => {
    if (this.size == "md" || this.size == "lg") {
      let inkBar = document.querySelector(".mat-ink-bar");
      if (tab === 0) {
        inkBar.setAttribute("style", "top:50px !important; width: 160px;");
      } else if (tab === 1) {
        inkBar.setAttribute("style", "top:125px !important;width: 160px;");
      } else if (tab === 2) {
        inkBar.setAttribute("style", "top:235px !important; width: 160px;");
      } else if (tab === 3) {
        inkBar.setAttribute("style", "top:340px !important; width: 160px;");
      }
    }
  };
}
