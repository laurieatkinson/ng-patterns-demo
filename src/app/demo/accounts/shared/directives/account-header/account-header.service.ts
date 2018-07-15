import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AccountDataService } from '../../services/account-data.service';
import { UserSessionService } from '../../../../../demo-common/services/user-session.service';

@Injectable()
export class AccountHeaderService {
    accountCode: string;
    accountName: string;
    accountType: string;
    accountStatus: string;
    private accountChangedSubscription: Subscription;
    private accountChangedSource = new Subject<void>();
    accountChanged = this.accountChangedSource.asObservable();

    constructor(private accountDataService: AccountDataService,
                private userSessionService: UserSessionService) {
    }

    initialize() {
        // After getting account data from the server,
        // update the header to match and let anyone using the header
        // that the data has changed, so the menu can be updated

        if (this.accountDataService.currentAccount &&
            !this.accountDataService.userSelectedAnotherAccount()) {
            this.populateFromDataService();
            this.handleAccountChanged();
            return Promise.resolve(this.accountDataService.currentAccount);
        } else {
            return this.refresh();
        }
    }

    refresh() {
        const promise = new Promise<null>((resolve, reject) => {
            this.accountDataService.getAccount()
            .then(() => {
                this.populateFromDataService();
                this.handleAccountChanged();
                resolve();
            }).catch((error) => {
                this.clearAccountHeader();
                reject(error);
            });
        });
        return promise;
    }
    updateAccountName(name: string) {
        this.accountName = name;
        this.accountDataService.userUpdatedAccountName(name);
    }

    private handleAccountChanged() {
        if (this.accountDataService.accountChanged && !this.accountChangedSubscription) {
            this.accountChangedSubscription = this.accountDataService.accountChanged.subscribe(() => {
                this.populateFromDataService();
                this.accountChangedSource.next();
            });
        }
    }

    private clearAccountHeader() {
        this.accountCode = '';
        this.accountName = '';
        this.accountType = '';
        this.accountStatus = '';
        this.userSessionService.clearAccount();
    }

    private populateFromDataService() {
        this.accountCode = this.accountDataService.currentAccount.accountCode.toUpperCase();
        this.accountName = this.accountDataService.currentAccount.accountName;
        this.accountType = this.accountDataService.currentAccount.accountType;
        this.accountStatus = this.accountDataService.currentAccount.accountStatus;
        this.userSessionService.accountType = this.accountDataService.currentAccount.accountType;
    }
}
