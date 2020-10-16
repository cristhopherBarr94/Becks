import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MenuStatusService {
  private _menuStatus = new Subject<string>();
  public menuStatus$ = this._menuStatus.asObservable();

  constructor() {}

  public statusMenu (state:string){
    this._menuStatus.next(state)
  }
}
