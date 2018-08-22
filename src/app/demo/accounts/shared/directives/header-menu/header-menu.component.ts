import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuItem} from 'primeng/primeng';
import { UserSessionService } from '../../../../../demo-common/services/user-session.service';
import { AccountHeaderService } from '../account-header/account-header.service';
import { MenuService } from '../../services/menu.service';
import { BaseComponent } from '../../../../../framework/components/base-component';
import { IServerError } from '../../../../../framework/validation/models/server-error.models';
import { GlobalEventsService } from '../../../../../framework/services/global-events.service';

@Component({
    selector: 'la-header-menu',
    templateUrl: './header-menu.component.html',
    styleUrls: ['./header-menu.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class HeaderMenuComponent extends BaseComponent implements OnInit, OnDestroy {

    items: MenuItem[];
    errorsFromServer = [];
    private menuUpdatedSource = new Subject<void>();
    menuUpdated = this.menuUpdatedSource.asObservable();

    constructor(private router: Router,
        private route: ActivatedRoute,
        public accountHeaderService: AccountHeaderService,
        private userSessionService: UserSessionService,
        private menuService: MenuService,
        protected globalEventsService: GlobalEventsService) {
            super();
            this.buildMenu();
    }

    ngOnInit() {
        if (this.route.params) {
            this.route.params.subscribe((params) => {
                const accountCode = params['code'];
                if (accountCode) {
                    this.userSessionService.accountCode = accountCode;

                    this.accountHeaderService.initialize().then(() => {
                        this.buildMenu();
                        this.eventSubscriptions.push(this.accountHeaderService.accountChanged.subscribe(() => {
                            this.buildMenu();
                        }));
                    }).catch((error: IServerError) => {
                        this.items = null;
                        this.errorsFromServer = this.populateErrors(error);
                    });
                }
            });
        }
    }

    navigate(event, path) {
        this.router.navigate(path, { relativeTo: this.route });
    }

    private buildMenu() {
        this.menuService.buildMenu(this.accountHeaderService.accountCode);
        this.items = this.menuService.menuItems;
        this.menuUpdatedSource.next();
    }
}
