import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { UiService } from 'src/app/_services/ui.service';

@Component({
  selector: 'user-sold-message',
  templateUrl: './sold-message.component.html',
  styleUrls: ['./sold-message.component.scss'],
})
export class SoldMessageComponent implements OnInit {
  Func:any;
  constructor(private ui: UiService,private modalCtrl: ModalController, private navParams: NavParams) { 
    this.Func = this.navParams.get("Func");
  }

  ngOnInit() {}

  close() {
    this.Func();
  }
}
