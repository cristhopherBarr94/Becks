import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "../_models/User";
import { HttpService } from "./http.service";

@Injectable({
  providedIn: "root",
})
export class UserService {

  private _userCodes = [];
  private _userCodeSbj = new Subject<any[]>();
  public userCodes$ = this._userCodeSbj.asObservable();

  private _user: User = new User();
  private _userSbj = new Subject<User>();
  public user$ = this._userSbj.asObservable();

  private _editingSbj = new Subject<any>();
  public editing$ = this._editingSbj.asObservable();

  private _dropdownMenu = new Subject<boolean>();
  public dropdownMenu$ = this._dropdownMenu.asObservable();

  private _imagenProfile = new Subject<string>();
  public imagenProfile$ = this._imagenProfile.asObservable();

  constructor(private http: HttpService) {
    if (localStorage.getItem("bks_user")) {
      this._user = new User(JSON.parse(localStorage.getItem("bks_user")));
    }
    if (localStorage.getItem("bks_user_codes")) {
      this._userCodes = (JSON.parse(localStorage.getItem("bks_user_codes")));
    }
  }

  public getActualUser(): User {
    return this._user;
  }

  public getData() {
    this.http.get( environment.serverUrl + environment.user.getData + "?time_stamp=" + new Date().getTime() ).subscribe(
      (response: any) => {
        if (response.status >= 200 && response.status < 300) {
          this._user = new User(response.body);
          if ( this._user.email != undefined ) {
            this._user.activate = this._userCodes && this._userCodes.length > 0;
            localStorage.setItem("bks_user", this._user.toJSON());
            this._userSbj.next(this._user);
          }
        } else {
          this._userSbj.error({});
        }
      },
      (error) => {
        this._userSbj.error(error);
      }
    );
  }

  public getActualUserCodes(): any[] {
    return this._userCodes;
  }

  public getCodes( forceUpdate? ) {
    
    if ( this._user != undefined && this._user.email ) {
      this._userSbj.next(this._user);
    } else {
      this.getData();
    }

    if ( !forceUpdate && (this._userCodes && this._userCodes.length > 0) ) {
      this._userCodeSbj.next(this._userCodes);
    } else {
      this.http.get(environment.serverUrl + environment.user.getCodes + "?time_stamp=" + new Date().getTime() ).subscribe(
        (res: any) => {
          if (res.status == 200 ) {
            this._userCodes = res.body || [];
            localStorage.setItem("bks_user_codes", JSON.stringify(this._userCodes) );
            this._userCodeSbj.next(this._userCodes);
          }
        }
      );
    }
    
  }

  public patchPassword(newPassword: string) {
    this.http
      .patch(environment.serverUrl + environment.user.patchPassword, {
        password: newPassword,
      })
      .subscribe(
        (response: any) => {
          if (response.status >= 200 && response.status < 300) {
            this._user = new User(response.body);
            this._user.activate = this._userCodes && this._userCodes.length > 0;
            this._userSbj.next(this._user);
          } else {
            this._userSbj.error({});
          }
        },
        (error) => {
          this._userSbj.error({});
        }
      );
  }

  public patchData(user: User) {
    this.http
      .patch(
        environment.serverUrl + environment.user.patchPassword,
        user.toJSON()
      )
      .subscribe(
        (response: any) => {
          if (response.status >= 200 && response.status < 300) {
            this._user = new User(response.body);
            this._user.activate = this._userCodes && this._userCodes.length > 0;
            this._userSbj.next(this._user);
          } else {
            this._userSbj.error({});
          }
        },
        (error) => {
          this._userSbj.error({});
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
    this._user = undefined;
    this._userCodes = [];
    localStorage.setItem("bks_user", null);
    localStorage.setItem("bks_user_codes", null);
    localStorage.removeItem("bks_user");
    localStorage.removeItem("bks_user_codes");
    this._userSbj.next(this._user);
    this._userCodeSbj.next(this._userCodes);
  }
}
