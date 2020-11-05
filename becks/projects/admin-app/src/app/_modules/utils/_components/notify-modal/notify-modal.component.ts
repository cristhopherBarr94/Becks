import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'notify-modal',
  templateUrl: './notify-modal.component.html',
  styleUrls: ['./notify-modal.component.scss'],
})
export class NotifyModalComponent implements OnInit {
  @Input() data:any;
  @Input() amount:any;
  @Input() allow:boolean;
  actFunc:any;
  delFunc:any;
  constructor(private modalCtrl: ModalController, private navParams: NavParams) {
    this.actFunc = this.navParams.get("actFunc");
    this.delFunc = this.navParams.get("delFunc");
   }
  async close () {
    await this.modalCtrl.dismiss();
  }
  activateUserParent() {
    this.actFunc();
  }
  deleteUserParent() {
    this.delFunc();
  }
  ngOnInit() {}

}
