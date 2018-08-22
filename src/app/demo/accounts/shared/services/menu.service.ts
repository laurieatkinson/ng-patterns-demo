import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { AuthorizationService } from '../../../../framework/services/authorization.service';
import { ActionCode } from '../../../../framework/models/authorization.types';

@Injectable()
export class MenuService {

    menuItems: MenuItem[];
    private id: string;

    constructor(private authorizationService: AuthorizationService) {
    }

    buildMenu(id: string) {
        this.id = id ? id.toLowerCase() : '';
        const accountRouteRoot = `/accounts/${this.id}`;
        this.menuItems = [
            {
                label: 'Component #1',
                routerLink: [accountRouteRoot],
                visible: this.showMenuItem('VIEW')
            },
            {
                label: 'Component #2',
                routerLink: [accountRouteRoot + `/child2`],
                visible: this.showMenuItem('VIEW')
            },
            {
                label: 'Component #3',
                routerLink: [accountRouteRoot + '/child3'],
                visible: this.showMenuItem('VIEW')
            }
        ]
    }

    private showMenuItem(actionCode: ActionCode) {
        return this.authorizationService.hasPermission(actionCode);
    }
}
