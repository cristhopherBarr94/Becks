import { Component, OnInit } from "@angular/core";

@Component({
  selector: "user-fb-button",
  templateUrl: "./fb-button.component.html",
  styleUrls: ["./fb-button.component.scss"],
})
export class FbButtonComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    this.fbLibrary();
  }

  fbLibrary() {
    (window as any).fbAsyncInit = function () {
      window["FB"].init({
        appId: "651296645541384",
        cookie: true,
        xfbml: true,
        version: "v8.0",
      });
      window["FB"].AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }

  loginFB() {
    window["FB"].login(
      (response) => {
        console.log("login response", response);
        if (response.authResponse) {
          window["FB"].api(
            "/me",
            {
              fields: "last_name, first_name, email, birthday, gender",
            },
            (userInfo) => {
              console.log("user information");
              console.log(userInfo);
            }
          );
        } else {
          console.log("User login failed");
        }
      },
      { scope: "email" }
    );
  }
}
