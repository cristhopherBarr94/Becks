import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { MockExperiencias } from "../_mocks/experiencias-mock";
import { Exp } from "../_models/exp";

@Injectable({
  providedIn: "root",
})
export class ExperienciasService {
  constructor() {}

  getExpContent(): Observable<Exp[]> {
    const ITEM_FOOTER: Exp[] = [];
    MockExperiencias.forEach((element) => {
      const elementoResponse: Exp = {
        id: element.id,
        cuentaActiva: element.cuentaActiva,
        detalleExp: element.detalleExp,
        imagesExp: element.imagesExp,
        titleExp: element.titleExp,
        fechaExp: element.fechaExp,
        detailExp: element.detailExp,
        placeExp: element.placeExp,
        urlExp: element.urlExp,
        status: element.status,
        colorExp: element.colorExp,
        horaExp: element.horaExp,
        type:element.type
      };
      ITEM_FOOTER.push(elementoResponse);
    });
    return of(ITEM_FOOTER);
  }
}
