import appConfig from 'config/app.config';

export class CreateURL {
  static auth() {
    return appConfig.apiEndPoint + appConfig.AUTH_PATH;
  }
  static logout() {
    return appConfig.apiEndPoint + appConfig.AUTH_LOGOUT;
  }
  static checkToken() {
    return `${appConfig.authEndpoint}/auth${appConfig.SESSIONS_URL}`;
  }
  static getSessionInfo() {
    return `${appConfig.authEndpoint}/auth${appConfig.SESSIONS_URL}`;
  }
  static redirectAuth() {
    return appConfig.apiEndPoint + appConfig.AUTH_REDIRECT;
  }
}
