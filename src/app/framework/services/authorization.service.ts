import { Injectable } from '@angular/core';
import { ActionCode } from '../models/authorization.types';
import { AuthorizationDataService } from './authorization-data.service';
import { AppConfig } from '../../app.config';

@Injectable()
export class AuthorizationService {

    permissions: Array<string>; // The actions for which this user has permissions

    constructor(private authorizationDataService: AuthorizationDataService) {
    }

    hasPermission(action: ActionCode) {
        if (!AppConfig.settings.aad.requireAuth || !action) {
            return true;
        }
        if (this.permissions && this.permissions.find(permission => {
                return permission === action;
                })) {
            return true;
        }
        return false;
    }

    initializePermissions() {
        return new Promise((resolve, reject) => {
            this.authorizationDataService.getPermissions()
                .then(permissions => {
                    this.permissions = permissions;
                    resolve();
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }
}
