import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { Exp } from "../_models/exp";
import { HttpService } from "./http.service";

@Injectable({
  providedIn: "root",
})
export class ExperienciasService {
  private _exps: Exp[] = [];
  private _expSbj = new Subject<Exp[]>();
  public exp$ = this._expSbj.asObservable();
  public options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "long",
  };
  constructor(private http: HttpService) {}

  getActualExps() {
    return this._exps;
  }

  getData() {
    const urlServer = environment.serverUrl;

    this.http
      .get(
        urlServer +
          environment.admin.getExp +
          "?time_stamp=" +
          new Date().getTime()
      )
      .subscribe(
        (response: any) => {
          if (response.status >= 200 && response.status < 300) {
            this._exps = [];
            response.body.forEach((element, index) => {
              const elementoResponse: Exp = new Exp();
              elementoResponse.id = element.id;
              elementoResponse.imagesExp =
                urlServer +
                environment.admin.getImgExp +
                element.id +
                "_desk" +
                "?time_stamp=" +
                new Date().getTime();
              elementoResponse.imagesExpMob =
                urlServer +
                environment.admin.getImgExp +
                element.id +
                "_mob" +
                "?time_stamp=" +
                new Date().getTime();
              elementoResponse.titleExp = element.title;
              elementoResponse.dateStart = element.valid_from * 1000;
              elementoResponse.dateEnd = element.valid_to * 1000;
              elementoResponse.dateActiv = element.activate_from * 1000;
              elementoResponse.dateActivTo = element.activate_to * 1000;
              elementoResponse.dateRelease = element.stock.release;
              elementoResponse.created = element.created;
              elementoResponse.stock = element.stock;
              elementoResponse.location = element.location;
              elementoResponse.descrip = element.description;
              elementoResponse.path = element.url_redirect;
              elementoResponse.status = element.status;
              elementoResponse.type = element.type;
              elementoResponse.urlTerms = element.url_terms;
              this._exps.push(elementoResponse);
              if (response.body.length - 1 == index) {
                this._expSbj.next(this._exps);
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
