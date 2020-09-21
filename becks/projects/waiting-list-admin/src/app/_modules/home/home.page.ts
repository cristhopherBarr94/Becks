import { Component } from '@angular/core';
import { async } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { NotifyModalComponent } from '../utils/_components/notify-modal/notify-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private modalCtrl: ModalController) {}

    async showModal() {
      const modal =  await this.modalCtrl.create({
        component: NotifyModalComponent,
        componentProps: {
          data:10
        }
      })
      await modal.present();
      modal.onDidDismiss()
      .then(res=> alert("success request: "+ JSON.stringify(res)))
    }

}
