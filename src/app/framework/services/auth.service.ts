/// <reference path="../../../../node_modules/@types/adal/index.d.ts" />
import { WebStorageService } from './web-storage.service';
import { Injectable } from '@angular/core';
import 'expose-loader?AuthenticationContext!adal-angular/lib/adal.js';
import { LoggingService } from '../logging/logging.service';
import { AppConfig } from '../../app.config';

@Injectable()
export class AuthService {
    public accessToken = '';
    public loginError = '';
    private originalRoute = window.location.pathname;
    private config: adal.Config = {
        tenant: AppConfig.settings.aad.tenant,
        clientId: AppConfig.settings.aad.clientId,
        postLogoutRedirectUri: window.location.origin,
        redirectUri: window.location.origin,
        navigateToLoginRequestUrl : false,
        cacheLocation: 'sessionStorage'
    };
    private currentUser: adal.User;
    private authContext: adal.AuthenticationContext;

    get isUserAuthenticated(): boolean {
        return !!this.currentUser;
    }
    get currentUserName(): string {
        return this.isUserAuthenticated ? this.currentUser.profile.name : '';
    }
    get currentUserLoginName(): string {
        return this.isUserAuthenticated ? (this.currentUser.userName !== '' ? this.currentUser.userName.split('@', 1)[0] : '' ) : '';
    }
    constructor(private loggingService: LoggingService) {
        if (AppConfig.settings.aad.requireAuth) {
            this.authContext = new AuthenticationContext(this.config);
            this.authenticate();
        }
    }

    authenticate() {
        const haveToken = this.authContext.isCallback(window.location.hash);
        if (haveToken) {
            this.originalRoute = WebStorageService.getSessionStorage('originalRoute');
            this.authContext.handleWindowCallback();
        } else {
            // Keep track of the url that the user wanted to use before logging in
            WebStorageService.setSessionStorage('originalRoute', this.originalRoute);
        }
        this.loginError = this.authContext.getLoginError();
        this.currentUser = this.authContext.getCachedUser();
    }

    getAccessToken() {
        const p = new Promise<string>((resolve, reject) => {
            this.authContext.acquireToken(AppConfig.settings.aad.clientId, (error, token) => {
                if (error || !token) {
                    this.loggingService.logError(
                        'ADAL error occurred in acquireToken: ' + error);
                    reject(error);
                } else {
                    resolve(token);
                }
            });
        });
        return p;
    }

    logIn() {
        this.authContext.login();
    }

    logOut() {
        this.authContext.logOut();
    }

    getOriginalRoute() {
        return this.originalRoute;
    }

    clearOriginalRoute() {
        if (this.originalRoute) {
            this.originalRoute = null;
            WebStorageService.removeSessionStorage('originalRoute');
        }
    }
}
