import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../model/User';
import { environment as envi } from 'src/environments/environment';
import { HttpService } from './HttpService';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  actionUrl: any;

  constructor(private httpService: HttpService) {
    this.actionUrl = envi.serverUrl;
  }

  setCreationUser(user: User): Observable<any> {
    const path = `${ this.actionUrl + envi.user.addWaiting}`;
    return this.httpService.post(path, user);
  }

  getUserTest(){
    const path = `${ this.actionUrl + envi.user.addWaiting}`;
    return this.httpService.get(path, {}).pipe(map((response: any) => {
      return response;
    }));
  }

  getUserApp(): Observable<User[]> {
    const path = `${ this.actionUrl + envi.user.list}`;
    return this.httpService.get(path, {}).pipe(map((response: User[]) => {
      return response;
    }));
  }

}
