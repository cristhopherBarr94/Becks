import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { HttpService } from "src/app/_services/http.service";
import { UiService } from "src/app/_services/ui.service";
import { UserService } from "src/app/_services/user.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "user-update-file",
  templateUrl: "./update-file.component.html",
  styleUrls: ["./update-file.component.scss"],
})
export class UpdateFileComponent implements OnInit {
  public photo: any;
  @Output() chargePhoto = new EventEmitter();
  constructor(
    private ui: UiService,
    private httpService: HttpService,
    private userSvc: UserService
  ) {}

  ngOnInit() {}

  loadImageFromDevice(event) {
    var files = event.target.files;
    var img = new Image();
    img = files[0];
    this.resizeImage(files[0], 720, 480).then((blob) => {
      if (files && blob) {
        var reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsBinaryString(blob);
      }
    });
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.photo = btoa(binaryString);
    this.ui.showLoading();
    this.httpService
      .patch(environment.serverUrl + environment.user.patchPhoto, {
        photo: this.photo,
      })
      .subscribe((response: any) => {
        this.userSvc.getData();
        this.userSvc.editing();
        this.ui.dismissLoading();
      });
  }

  emiteImageBase64 = (fileBase64) => {
    this.chargePhoto.emit(fileBase64);
  };

  resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        let width = image.width;
        let height = image.height;
        if (width <= maxWidth && height <= maxHeight) {
          resolve(file);
        }
        let newWidth;
        let newHeight;
        if (width > height) {
          newHeight = height * (maxWidth / width);
          newWidth = maxWidth;
        } else {
          newWidth = width * (maxHeight / height);
          newHeight = maxHeight;
        }
        let canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, newWidth, newHeight);
        canvas.toBlob(resolve, file.type);
      };
      image.onerror = reject;
    });
  }

  closeModal() {
    this.userSvc.editing();
    this.ui.dismissModal();
  }

  deletePhoto() {
    this.ui.showLoading();
    this.httpService
      .delete(environment.serverUrl + environment.user.patchPhoto)
      .subscribe((response: any) => {
        this.userSvc.getData();
        this.ui.dismissLoading();
      });
  }
}
