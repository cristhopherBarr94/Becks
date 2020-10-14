import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'user-home-exp',
  templateUrl: './home-exp.page.html',
  styleUrls: ['./home-exp.page.scss'],
})
export class HomeExpPage implements OnInit {

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
    this.modalCtrl.dismiss();

  }

}
