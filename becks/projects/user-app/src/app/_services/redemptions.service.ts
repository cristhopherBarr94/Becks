import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class RedemptionsService {
  
  private _redemps: [] = [];
  private _redempSbj = new Subject<[]>();
  public redemp$ = this._redempSbj.asObservable();

  constructor(private http: HttpService) {}

  getActualRedemps() {
    return this._redemps;
  }

  getData() {
    this.http.get( environment.serverUrl + environment.user.getRedemp + "?time_stamp=" + new Date().getTime() ).subscribe(
      (response: any) => {
        if (response.status >= 200 && response.status < 300) {
          this._redemps = response.body;
          this._redempSbj.next(this._redemps);
        } else {
          // TODO :: logic for error
        }
      },
      (error) => {
        // TODO :: logic for error
      }
    );
  }

  postRedemption( eid: number , cid: number ) : Observable<any>{

    return this.http.post(  environment.serverUrl + environment.user.postRedemp , 
                            { 'eid' : eid, 'cid' : cid, } );
  }
}
