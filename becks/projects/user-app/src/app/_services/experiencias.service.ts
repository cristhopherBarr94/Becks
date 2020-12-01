import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { environment } from 'src/environments/environment';
import { Exp } from "../_models/exp";
import { HttpService } from './http.service';

@Injectable({
  providedIn: "root",
})
export class ExperienciasService {
  
  private _exps: Exp[] = [];
  private _expSbj = new Subject<Exp[]>();
  public exp$ = this._expSbj.asObservable();
  public   options = {
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

    this.http.get( urlServer + environment.user.getExp + "?time_stamp=" + new Date().getTime() ).subscribe(
      (response: any) => {
        if (response.status >= 200 && response.status < 300) {
          this._exps = [];
          response.body.forEach((element, index) => {
            const elementoResponse: Exp = {
              id: element.id,
              stock_actual: element.stock_actual,
              detalleExp: false,
              imagesExp: urlServer + environment.user.getImgExp + element.id + "_desk",
              imagesExpMob: urlServer + environment.user.getImgExp + element.id + "_mob",
              titleExp: element.title,
              fechaExp: (new Date(element.valid_to*1000)).toLocaleString().split(" ")[0],
              fechaAlt: (new Date(element.valid_from*1000)).toLocaleString().split(" ")[0],
              detailExp: element.description,
              placeExp: element.location,
              urlExp: element.url_terms,
              status: element.status,
              horaExp: element.horaExp,
              type:element.type,
              urlRedirect:element.url_redirect
            };
            this._exps.push(elementoResponse);
            if ( response.body.length-1 == index ) {
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
