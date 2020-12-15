import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'waiting-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss'],
})
export class PopUpComponent implements OnInit {
  @Input() title:string;
  @Input() sub_title:string;
  @Input() title_button:string;
  @Input() allow:boolean;
  @Input() cod:string;
  Func:any;
  FuncAlt:any;
  constructor(private modalCtrl: ModalController, private navParams: NavParams) {
    this.Func = this.navParams.get("Func");
    this.FuncAlt = this.navParams.get("FuncAlt");
   }
  async close () {
    await this.modalCtrl.dismiss();
  }
  activateUserParent() {
    this.Func();
  }
  toCloseMod() {
    this.FuncAlt();
  }
  ngOnInit() {}

}