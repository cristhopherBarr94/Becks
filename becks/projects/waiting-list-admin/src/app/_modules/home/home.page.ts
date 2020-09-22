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
  deleteUsers: any[] = ['11','12','13'];
  constructor(private modalCtrl: ModalController) {}

    async showModal() {
      const modal =  await this.modalCtrl.create({
        component: NotifyModalComponent,
        cssClass: 'modalMessage',
        componentProps: {
          data:this.deleteUsers,
          amount: this.deleteUsers.length,
          actFunc: this.activateUser.bind(this)
        }
      })
      await modal.present();
      modal.onDidDismiss()
      // .then(res=> alert("success request: "+ JSON.stringify(res)))
    }

    activateUser(){
      console.log("funcion activar usuarios desde la futura table");
    }
}
