import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserSessionService } from '../../../../../demo-common/services/user-session.service';
import { PostingService } from '../../../../../demo-common/services/posting.service';
import { AccountHeaderService } from './account-header.service';
import { BaseComponent } from '../../../../../framework/components/base-component';
import { IServerError } from '../../../../../framework/validation/models/server-error.models';
import { GlobalEventsService } from '../../../../../framework/services/global-events.service';

@Component({
    selector: 'la-account-header',
    templateUrl: './account-header.component.html',
    styleUrls: ['./account-header.component.scss']
})
export class AccountHeaderComponent extends BaseComponent implements OnInit {

    @Output() postChanges: EventEmitter<null> = new EventEmitter();
    errorsFromServer = [];
    isPlanReadOnly = false;

    constructor(private router: Router,
        private route: ActivatedRoute,
        public accountHeaderService: AccountHeaderService,
        private postingService: PostingService,
        private userSessionService: UserSessionService,
        protected globalEventsService: GlobalEventsService) {
        super();
    }

    ngOnInit() {
        if (this.route.params) {
            this.eventSubscriptions.push(this.route.params.subscribe((params) => {
                const accountCode = params['code'];
                this.userSessionService.accountCode = accountCode;

                this.accountHeaderService.initialize()
                    .catch((error: IServerError) => {
                        this.errorsFromServer = this.populateErrors(error);
                    });
            }));
        }
    }

    get accountCode() {
        return this.accountHeaderService.accountCode;
    }

    get topHeader() {
        let header = '';
        if (this.accountHeaderService.accountCode) {
            header += this.accountHeaderService.accountCode.toUpperCase();
        }

        if (this.accountHeaderService.accountName) {
            header += ' - ' + this.accountHeaderService.accountName;
        }
        return header;
    }

    refresh() {
        return this.accountHeaderService.refresh()
            .catch((error: IServerError) => {
                this.errorsFromServer = this.populateErrors(error);
            });
    }

    postChangesClick() {
        this.postChanges.emit();
    }

    canCommit() {
        return this.postingService.canCommit();
    }

    goToPlanHome() {
        this.router.navigate([`${this.accountRouteRoot}`]);
    }

    private get accountRouteRoot() {
        return `/accounts/${this.userSessionService.accountCode}`;
    }
}
