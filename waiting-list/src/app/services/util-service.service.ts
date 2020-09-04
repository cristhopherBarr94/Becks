import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilServiceService {

  loading: any;

  constructor(public loadingController: LoadingController) { }

  public async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      cssClass: 'becks-loading',
      message
    });
    this.loading = await loading.present();
  }
}
