export class WebStorageService {

    static setLocalStorage(key: string, data: string): void {
        localStorage.setItem(key, data);
    }
    static getLocalStorage(key: string): string | null {
        return localStorage.getItem(key);
    }
    static removeLocalStorage(key: string) {
        localStorage.removeItem(key);
    }
    static setSessionStorage(key: string, data: string): void {
        sessionStorage.setItem(key, data);
    }
    static getSessionStorage(key: string): string | null {
        return sessionStorage.getItem(key);
    }
    static removeSessionStorage(key: string) {
        sessionStorage.removeItem(key);
    }
}
