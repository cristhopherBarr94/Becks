import { Injectable } from "@angular/core";
import { SHA256, SHA512 } from "crypto-js";

@Injectable({
  providedIn: "root",
})
export class UtilService {
  constructor() {}

  getCookie(name: string) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  getCaptchaKey() {
    return Math.floor(Math.random() * (999999999999 - 121212) + 121212);
  }

  getCaptchaHash(email: string, key: number) {
    return SHA512(
      'setupCaptchaValidator("' + email + "-" + key + '")'
    ).toString();
  }

  getSHA256(word: string) {
    return SHA256(word).toString();
  }
}
