import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "../_models/User";
import { HttpService } from "./http.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
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
  }

  public getActualUser(): User {
    return this._user;
  }

  public getData() {
    this.http.get(environment.serverUrl + environment.user.getData).subscribe(
      (response: any) => {
        if (response.status >= 200 && response.status < 300) {
          this._user = new User(response.body);
          localStorage.setItem("bks_user", this._user.toJSON());
          this._userSbj.next(this._user);
        } else {
          this._userSbj.error({});
        }
      },
      (error) => {
        this._userSbj.error(error);
      }
    );
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
  public setActivate(status:boolean) {
    this._user.activate = status;
    this._userSbj.next(this._user);
  }
}
