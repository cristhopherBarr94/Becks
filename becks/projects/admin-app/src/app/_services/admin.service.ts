import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "../_models/User";
import { HttpService } from "./http.service";

@Injectable({
  providedIn: "root",
})
export class AdminService {


  private _admin: User = new User();
  private _adminSbj = new Subject<User>();
  public admin$ = this._adminSbj.asObservable();

  private _editingSbj = new Subject<any>();
  public editing$ = this._editingSbj.asObservable();

  private _dropdownMenu = new Subject<boolean>();
  public dropdownMenu$ = this._dropdownMenu.asObservable();

  private _imagenProfile = new Subject<string>();
  public imagenProfile$ = this._imagenProfile.asObservable();

  constructor(private http: HttpService) {
    if (localStorage.getItem("bks_admin")) {
      this._admin = new User(JSON.parse(localStorage.getItem("bks_admin")));
    }
  }

  public getActualAdmin(): User {
    return this._admin;
  }

  public getData() {
    this.http.get( environment.serverUrl + environment.admin.getData + "?time_stamp=" + new Date().getTime() ).subscribe(
      (response: any) => {
        if (response.status >= 200 && response.status < 300) {
          this._admin = new User(response.body);
          if ( this._admin.email != undefined ) {
            localStorage.setItem("bks_admin", this._admin.toJSON());
            this._adminSbj.next(this._admin);
          }
        } else {
          this._adminSbj.error({});
        }
      },
      (error) => {
        this._adminSbj.error(error);
      }
    );
  }

  public patchPassword(newPassword: string) {
    this.http
      .patch(environment.serverUrl + environment.admin.patchPassword, {
        password: newPassword,
      })
      .subscribe(
        (response: any) => {
          if (response.status >= 200 && response.status < 300) {
            this._admin = new User(response.body);
            this._adminSbj.next(this._admin);
          } else {
            this._adminSbj.error({});
          }
        },
        (error) => {
          this._adminSbj.error({});
        }
      );
  }

  public patchData(admin: User) {
    this.http
      .patch(
        environment.serverUrl + environment.admin.patchPassword,
        admin.toJSON()
      )
      .subscribe(
        (response: any) => {
          if (response.status >= 200 && response.status < 300) {
            this._admin = new User(response.body);
            this._adminSbj.next(this._admin);
          } else {
            this._adminSbj.error({});
          }
        },
        (error) => {
          this._adminSbj.error({});
        }
      );
  }

  public editing() {
    this._editingSbj.next(true);
    setTimeout(() => {
      this._editingSbj.next(false);
    }, 1500);
  }

  public dropdownMenu (state:boolean){
    this._dropdownMenu.next(state)
  }

  public profilePicture (state:string){
    this._imagenProfile.next(state)
  }

  public logout() {
    this._admin = undefined;
    localStorage.setItem("bks_admin", null);
    localStorage.removeItem("bks_admin");
    this._adminSbj.next(this._admin);
  }
}
