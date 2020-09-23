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
  rest: {
    client_id: "ed9d6754-a686-487e-ac99-4c1ce919912f",
    client_secret: "WebAppConsumer",
    scope: "administrator web_app",
    grant_type: "password"
  }
};
