import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class RedemptionsService {
  
  private _redemps: [] = [];
  private _redempSbj = new Subject<[]>();
  public exp$ = this._redempSbj.asObservable();

  constructor(private http: HttpService) {}

  getActualExps() {
    return this._redemps;
  }

  getData() {
    this.http.get( environment.serverUrl + environment.user.getRedemp + "?time_stamp=" + new Date().getTime() ).subscribe(
      (response: any) => {
        if (response.status >= 200 && response.status < 300) {
          this._redemps = response.body;
        } else {
          // TODO :: logic for error
        }
      },
      (error) => {
        // TODO :: logic for error
      }
    );
  }

  postRedemption( uid: number , eid: number , cid: number ) : Observable<Response>{
    let ITEM_RESPONSE: Response;
    this.http.post( environment.serverUrl + environment.user.postRedemp , 
                    { 'uid' : uid, 'eid' : eid, 'cid' : cid, } ).subscribe(
      (response: any) => {
        ITEM_RESPONSE = response;
      },
      (error) => {
        ITEM_RESPONSE = error;
      }
    );
    return of(ITEM_RESPONSE);
  }
}
