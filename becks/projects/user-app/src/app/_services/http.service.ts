import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { throwError } from "rxjs/internal/observable/throwError";
import { catchError } from "rxjs/operators";
import { HttpConstants } from "../_constans/HttpConstants";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getHeaders() {
    let token = "";
    if (typeof this.authService.getToken() == "string") {
      token = this.authService.getToken();
    }
    return {
      "Content-Type": "application/json; charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE",
      Authorization: token,
    };
  }

  getHeadersFormData() {
    let token = "";
    if (typeof this.authService.getToken() == "string") {
      token = this.authService.getToken();
    }
    return {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE",
      Authorization: token,
    };
  }

  public get(url: string, headersIn?: any): Observable<object> {
    if (headersIn == null) {
      headersIn = this.getHeaders();
    }
    if (url.indexOf("?") > -1) {
      if (url.indexOf("time_stamp") == -1) {
        url = url + "&time_stamp=" + Math.floor(Date.now() / 1000);
      }
    } else {
      url = url + "?time_stamp=" + Math.floor(Date.now() / 1000);
    }
    return this.http
      .get(url, {
        headers: headersIn,
        observe: "response",
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  public post(url: string, body?: any, headersIn?: any): Observable<object> {
    if (headersIn == null) {
      headersIn = this.getHeaders();
    }
    return this.http
      .post(url, body, {
        headers: headersIn,
        observe: "response",
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  public postFormData(
    url: string,
    body?: FormData,
    headersIn?: any
  ): Observable<object> {
    if (headersIn == null) {
      headersIn = this.getHeadersFormData();
    }
    console.log(url);

    return this.http
      .post(url, body, {
        headers: headersIn,
        observe: "response",
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  public put(url: string, body?: any, headersIn?: any): Observable<object> {
    if (headersIn == null) {
      headersIn = this.getHeaders();
    }
    return this.http
      .put(url, body, {
        headers: headersIn,
        observe: "response",
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  public patch(url: string, body?: any, headersIn?: any): Observable<object> {
    if (headersIn == null) {
      headersIn = this.getHeaders();
    }
    return this.http
      .patch(url, body, {
        headers: headersIn,
        observe: "response",
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  public delete(url: string, headersIn?: any): Observable<object> {
    if (headersIn == null) {
      headersIn = this.getHeaders();
    }
    return this.http
      .delete(url, {
        headers: headersIn,
        observe: "response",
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === HttpConstants.UNAUTHORIZED) {
      this.authService.setAuthenticated(null);
      location.reload();
    } else if (error.status === HttpConstants.CONFLICT) {
      console.log("mensaje incorrecto");
    } else if (
      error.status === HttpConstants.INTERNAL_SERVER_ERROR ||
      error.status === HttpConstants.SERVICE_UNAVAILABLE
    ) {
      console.log("mensaje de servidor error");
    } else if (!error.ok) {
      console.log("ERROR ::: ", error);
    }
    return throwError(error);
  }
}
