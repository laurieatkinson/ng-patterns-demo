import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { UserSessionService } from '../../../../../demo-common/services/user-session.service';
import { AccountHeaderService } from '../account-header/account-header.service';
import { PlanMenuService } from '../../services/plan-menu.service';
import { BaseComponent } from '../../../../../framework/components/base-component';
import { IServerError } from '../../../../../framework/validation/models/server-error.models';
import { MenuItem} from 'primeng/primeng';
import { GlobalEventsService } from '../../../../../framework/services/global-events.service';

@Component({
    selector: 'la-plan-header-menu',
    templateUrl: './plan-header-menu.component.html',
    styleUrls: ['./plan-header-menu.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class PlanHeaderMenuComponent extends BaseComponent implements OnInit, OnDestroy {

    items: MenuItem[];
    errorsFromServer = [];
    planSubmenuItems: Array<any>;
    private menuUpdatedSource = new Subject<void>();
    menuUpdated = this.menuUpdatedSource.asObservable();
    currentRoute: string;

    constructor(private router: Router,
        private route: ActivatedRoute,
        public accountHeaderService: AccountHeaderService,
        private userSessionService: UserSessionService,
        private planMenuService: PlanMenuService,
        protected globalEventsService: GlobalEventsService) {
            super();
            this.currentRoute = this.router.url;
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
        this.planMenuService.buildMenu(this.accountHeaderService.accountCode);
        this.items = this.planMenuService.menuItems;
        this.menuUpdatedSource.next();
    }
}
