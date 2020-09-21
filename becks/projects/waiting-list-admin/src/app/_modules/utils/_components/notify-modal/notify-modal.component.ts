import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'notify-modal',
  templateUrl: './notify-modal.component.html',
  styleUrls: ['./notify-modal.component.scss'],
})
export class NotifyModalComponent implements OnInit {
  @Input() data:any;
  constructor(private modalCtrl: ModalController) { }
  async close() {
    await this.modalCtrl.dismiss({
      userData: 3
    });
  }


  ngOnInit() {}
  async activateUser() {
    console.log(this.data);
  }
}
