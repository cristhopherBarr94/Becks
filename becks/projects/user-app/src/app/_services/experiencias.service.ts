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
        imagesExpMob: element.imagesExpMob,
        titleExp: element.titleExp,
        fechaExp: element.fechaExp,
        fechaAlt: element.fechaAlt,
        detailExp: element.detailExp,
        placeExp: element.placeExp,
        urlExp: element.urlExp,
        status: element.status,
        horaExp: element.horaExp,
        type:element.type,
        urlRedirect:element.urlRedirect
      };
      ITEM_FOOTER.push(elementoResponse);
    });
    return of(ITEM_FOOTER);
  }
}
