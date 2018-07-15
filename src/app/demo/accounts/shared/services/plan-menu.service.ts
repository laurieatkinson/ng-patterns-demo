import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/primeng';
import { AuthorizationService } from '../../../../framework/services/authorization.service';
import { ActionCode } from '../../../../framework/models/authorization.types';

@Injectable()
export class PlanMenuService {

    menuItems: MenuItem[];
    currentRoute: string;
    private id: string;

    constructor(private authorizationService: AuthorizationService,
        private router: Router
    ) {
        this.currentRoute = this.router.url;
    }

    buildMenu(id: string) {
        this.id = id ? id.toLowerCase() : '';
        const planRouteRoot = `/accounts/${this.id}`;
        this.menuItems = [
            {
                label: 'Component #1',
                routerLink: [planRouteRoot],
                visible: this.showMenuItem('VIEW')
            },
            {
                label: 'Component #2',
                routerLink: [planRouteRoot + `/child2`],
                visible: this.showMenuItem('VIEW')
            },
            {
                label: 'Component #3',
                routerLink: [planRouteRoot + '/child3'],
                visible: this.showMenuItem('VIEW')
            }
        ]
    }

    private showMenuItem(actionCode: ActionCode) {
        return this.authorizationService.hasPermission(actionCode);
    }
}
