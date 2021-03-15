export const environment = {
  production: true,
  serverUrl: "https://becks.flexitco.co/becks-back",
  validation: {
    resource: "/api/ab-inbev-api-web-app-user-list-api/",
  },
  login: {
    resource: "/oauth/token?_format=json",
  },
  logout: {
    resource: "/user/logout",
  },
  guest: {
    postForm: "/api/ab-inbev-api-usercustom/",
    patchPassword: "/api/ab-inbev-api-usercustom/0",
  },
  user: {
    getData: "/api/ab-inbev-api-user-app/0",
    patchPassword: "/api/ab-inbev-api-user-app/0",
    patchData: "/api/ab-inbev-api-user-app/1",
    patchPhoto: "/api/ab-inbev-api-user-app/2",
    patchActivate: "/api/ab-inbev-api-code-app/1",
    getCodes: "/api/ab-inbev-api-code-app/2",
    getExp: "/api/ab-inbev-api-experience/0",
    getImgExp: "/sites/default/files/images/experience/", // id_desk && id_mob
    getPdfExp: "/sites/default/files/pdfs/experience/", // id.pdf
    postRedemp: "/api/ab-inbev-api-redemption/",
    getRedemp: "/api/ab-inbev-api-redemption/1",
  },
  rest: {
    client_id: "ed9d6754-a686-487e-ac99-4c1ce919912f",
    client_secret: "WebAppConsumer",
    scope: "web_app",
    grant_type: "password",
  },
};
