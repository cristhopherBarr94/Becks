import { Component, OnInit } from "@angular/core";

@Component({
  selector: "user-update-file",
  templateUrl: "./update-file.component.html",
  styleUrls: ["./update-file.component.scss"],
})
export class UpdateFileComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  loadImageFromDevice(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      let blob: Blob = new Blob([new Uint8Array(reader.result as ArrayBuffer)]);
      let blobURL: string = URL.createObjectURL(blob);
    };
    reader.onerror = (error) => {};
  }
}
