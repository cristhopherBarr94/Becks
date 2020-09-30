import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "../_models/User";
import { HttpService } from "./http.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  public _user: User = new User();
  private _userSbj = new Subject<User>();
  public user$ = this._userSbj.asObservable();

  constructor(private http: HttpService) {
    if (localStorage.getItem("bks_user")) {
      this._user = new User(JSON.parse(localStorage.getItem("bks_user")));
    }
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
}
