export default class SessionStorage {
  static getItem(name: string): string {
    return sessionStorage.getItem(name) ?? '';
  }
  static setItem(name: string, value: string): void {
    sessionStorage.setItem(name, value);
  }
  static removeItem(name: string): void {
    sessionStorage.removeItem(name);
  }
  static clear(): void {
    sessionStorage.clear();
  }
}
