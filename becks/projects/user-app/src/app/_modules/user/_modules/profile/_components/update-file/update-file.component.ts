import { Component, OnInit } from "@angular/core";

@Component({
  selector: "user-update-file",
  templateUrl: "./update-file.component.html",
  styleUrls: ["./update-file.component.scss"],
})
export class UpdateFileComponent implements OnInit {
  public photo: any;
  constructor() {}

  ngOnInit() {}

  loadImageFromDevice(event) {
    var files = event.target.files;
    var img = new Image();
    img = files[0];
    console.log(
      "UpdateFileComponent -> loadImageFromDevice -> image",
      img.sizes
    );
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
    console.log(
      "UpdateFileComponent -> _handleReaderLoaded -> btoa(binaryString)",
      btoa(binaryString)
    );
  }

  resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        let width = image.width;
        console.log("UpdateFileComponent -> image.onload -> width", width);
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
}
