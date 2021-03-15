import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpService } from "./http.service";

@Injectable({
  providedIn: 'root'
})

export class FilesService {
  private _expsFiles: any[] = [];
  private _expFilesSbj = new Subject<any[]>();
  public expFiles$ = this._expFilesSbj.asObservable();
  constructor(private http: HttpService) { }

  getActualExpsFiles() {
    return this._expsFiles;
  }

  getDataFiles() {
    const urlServer = environment.serverUrl;

    this.http
      .get(
        urlServer +
          environment.user.getPdfExp +
          "?time_stamp=" +
          new Date().getTime()
      )
      .subscribe(
        (response: any) => {
          if (response.status >= 200 && response.status < 300) {
            this._expsFiles = [];

            response.body.forEach((element, index) => {
              const elementoResponse = {
                id: element.id,
                titleExp: element.title,
                file: element.file
              };
              this._expsFiles.push(elementoResponse);
              if (response.body.length - 1 == index) {
                this._expFilesSbj.next(this._expsFiles);
              }
            });
          } else {
            // TODO :: logic for error
          }
        },
        (error) => {
          // TODO :: logic for error
        }
      );
  }
}
