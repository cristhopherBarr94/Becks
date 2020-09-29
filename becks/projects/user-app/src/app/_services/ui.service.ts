import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { LoadingComponent } from "../_modules/utils/_components/loading/loading.component";

@Injectable({
  providedIn: "root",
})
export class UiService {
  loading: any;

  constructor(public modalCtrl: ModalController) {}

  async showLoading(text?: string) {
    try {
      // this.dismissLoading();
      this.loading = await this.modalCtrl.create({
        component: LoadingComponent,
        cssClass: "loading-modal",
        animated: true,
        showBackdrop: true,
        backdropDismiss: false,
      });
      await this.loading.present();
    } catch (e) {
      console.error("showLoading", e);
    }
  }

  dismissLoading(timeOut: number = 1000) {
    try {
      if (this.loading) {
        this.loading.dismiss("cancel");
      }
    } catch (e) {
      console.error("dismissLoading", e);
    }
    setTimeout(() => {
      this.modalCtrl.getTop().then((topOverlay) => {
        if (topOverlay !== undefined) {
          this.modalCtrl.dismiss();
        }
      });
    }, timeOut);
  }

  getSizeType(width: number) {
    if (width < 768) {
      return "xs";
    } else if (width >= 768 && width < 992) {
      return "sm";
    } else if (width >= 992 && width < 1200) {
      return "md";
    } else {
      return "lg";
    }
  }
}
