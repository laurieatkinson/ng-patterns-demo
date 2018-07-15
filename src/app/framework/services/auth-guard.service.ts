import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthorizationService } from './authorization.service';
import { AppConfig } from '../../app.config';
import { ActionCode } from '../models/authorization.types';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(protected router: Router, protected authService: AuthService,
                protected authorizationService: AuthorizationService) {
    }

    canActivate(route: ActivatedRouteSnapshot): Promise<boolean> | boolean {
        return this.hasRequiredPermission(route.data['actionCode']);
    }

    protected hasRequiredPermission(actionCode: ActionCode): Promise<boolean> | boolean {
        if (!AppConfig.settings.aad.requireAuth) {
            return true;
        } else if (this.authService.isUserAuthenticated) {
            if (this.authorizationService.permissions) {
                if (actionCode) {
                    return this.authorizationService.hasPermission(actionCode);
                } else {
                    return this.authorizationService.hasPermission(null);
                }
            } else {
                const promise = new Promise<boolean>((resolve, reject) => {
                    this.authorizationService.initializePermissions()
                        .then(() => {
                            if (actionCode) {
                                resolve(this.authorizationService.hasPermission(actionCode));
                            } else {
                                resolve(this.authorizationService.hasPermission(null));
                            }
                        }).catch(() => {
                            resolve(false);
                        });
                });
                return promise;
            }
        } else {
            this.authService.logIn();
            return false;
        }
    }
}
