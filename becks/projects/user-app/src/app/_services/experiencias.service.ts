import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from 'src/environments/environment';
import { Exp } from "../_models/exp";
import { HttpService } from './http.service';

@Injectable({
  providedIn: "root",
})
export class ExperienciasService {
  constructor(private http: HttpService) {
    
  }

  getExpContent(): Observable<Exp[]> {
    const ITEM_FOOTER: Exp[] = [];
    const urlServer = environment.serverUrl;

    this.http.get( urlServer + environment.user.getExp + "?time_stamp=" + new Date().getTime() ).subscribe(
      (response: any) => {
        if (response.status >= 200 && response.status < 300) {
          console.log(response.body);
          response.body.forEach((element) => {

            const elementoResponse: Exp = {
              id: element.id,
              stock_actual: element.stock_actual,
              detalleExp: false,
              imagesExp: urlServer + environment.user.getImgExp + element.id + "_desk",
              imagesExpMob: urlServer + environment.user.getImgExp + element.id + "_mob",
              titleExp: element.title,
              fechaExp: (new Date(element.valid_to*1000)).toString(),
              fechaAlt: element.fechaAlt,
              detailExp: element.description,
              placeExp: element.location,
              urlExp: element.url_terms,
              status: element.status,
              horaExp: element.horaExp,
              type:element.type,
              urlRedirect:element.url_redirect
            };
            ITEM_FOOTER.push(elementoResponse);
          });
        } else {

        }
      },
      (error) => {
        
      }
    );
   
    return of(ITEM_FOOTER);
  }


}
