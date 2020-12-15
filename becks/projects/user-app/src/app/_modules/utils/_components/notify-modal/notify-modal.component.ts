import { Component, OnInit, Input } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";

@Component({
  selector: "notify-modal",
  templateUrl: "./notify-modal.component.html",
  styleUrls: ["./notify-modal.component.scss"],
})
export class NotifyModalComponent implements OnInit {
  @Input() title: string;
  @Input() sub_title: string;
  @Input() sub_title_green: string;
  @Input() title_button: string;
  @Input() allow: boolean;
  @Input() prom_cod: string;
  Func: any;
  FuncAlt: any;
  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {
    this.Func = this.navParams.get("Func");
    this.FuncAlt = this.navParams.get("FuncAlt");
  }
  async close() {
    await this.modalCtrl.dismiss();
  }
  activateUserParent() {
    this.Func();
    // this.close();
  }
  toCloseMod() {
    this.FuncAlt();
  }
  ngOnInit() {}
}
