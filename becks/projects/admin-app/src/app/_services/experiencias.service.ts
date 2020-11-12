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

    this.http.get( urlServer + environment.admin.getExp + "?time_stamp=" + new Date().getTime() ).subscribe(
      (response: any) => {
        if (response.status >= 200 && response.status < 300) {
          console.log(response.body)
          this._exps = [];
          response.body.forEach((element, index) => {
            const elementoResponse: Exp = {
              id: element.id,
              imagesExp: urlServer + environment.admin.getImgExp + element.id + "_desk",
              imagesExpMob: urlServer + environment.admin.getImgExp + element.id + "_mob",
              titleExp: element.title,
              dateStart: element.valid_from*1000,
              dateEnd: element.valid_to*1000,
              dateRelease: element.stock.release*1000,
              stock: element.stock,
              location: element.location,
              descrip: element.description,
              path: element.url_redirect,
              status: element.status,
              type: element.type,
              urlTerms: element.url_terms,
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
