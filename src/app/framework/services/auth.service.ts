import { Injectable } from '@angular/core';
import { AdalService } from 'adal-angular4';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    _isUserAuthenticated: boolean;
    _userName: string;

    constructor(private adalService: AdalService) {
    }

    get isUserAuthenticated() {
        return this.adalService.userInfo ? this.adalService.userInfo.authenticated : false;
    }

    get userName() {
        return this.adalService.userInfo ? this.adalService.userInfo.userName : '';
    }

    login() {
        this.adalService.login();
    }

    logout(): void {
        this.adalService.logOut();
    }
}
