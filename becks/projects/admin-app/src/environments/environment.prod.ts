export const environment = {
  production: true,
  serverUrl: 'https://waitinglist.becksociety.com.co',
  validation: {
    resource: '/api/ab-inbev-api-web-app-user-list-api/'
  },
  login: {
    resource: '/oauth/token?_format=json'
  },
  logout: {
    resource: '/user/logout'
  },
  admin: {
    getData: "/api/ab-inbev-api-user-app/0",
    patchPassword: "/api/ab-inbev-api-user-app/0",
    patchData: "/api/ab-inbev-api-user-app/1",
    patchPhoto: "/api/ab-inbev-api-user-app/2",
    patchActivate: "/api/ab-inbev-api-code-app/1",
    getCodes: "/api/ab-inbev-api-code-app/1",
    getExp: "/api/ab-inbev-api-experience/1",
    postExp: "/api/ab-inbev-api-experience/",
    patchExp: "/api/ab-inbev-api-experience/0",
    getImgExp: "/sites/default/files/images/experience/", // id_desk && id_mob
    getPdfExp: "/sites/default/files/pdfs/experience/", // id.pdf
    postRedemp: "/api/ab-inbev-api-redemption/",
    getRedemp: "/api/ab-inbev-api-redemption/1",
  },
  rest: {
    client_id: "ed9d6754-a686-487e-ac99-4c1ce919912f",
    client_secret: "WebAppConsumer",
    scope: "administrator web_app",
    grant_type: "password"
  }
};
