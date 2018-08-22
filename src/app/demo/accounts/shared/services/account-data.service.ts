import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TransactionEntityDataService } from '../../../../demo-common/services/transaction-entity-data.service';
import { IAccount } from '../models/account.models';

@Injectable()
export class AccountDataService extends TransactionEntityDataService {

    private _currentAccount: IAccount;
    private accountChangedSource = new Subject<void>();
    accountChanged = this.accountChangedSource.asObservable();

    get currentAccount() {
        return this._currentAccount;
    }

    userSelectedAnotherAccount() {
        return this.currentAccount.accountCode !== this.userSessionService.accountCode;
    }

    userUpdatedAccountName(name) {
        this.currentAccount.accountName = name;
    }

    getAccount(): Promise<IAccount> {
        const endpoint = this.endpoint();
        return this.get<IAccount>(endpoint).then((account: IAccount) => {
            this._currentAccount = account;
            this.accountChangedSource.next();
            return account;
        });
    }

    endpoint() {
        return this.constructEndpoint('');
    }
}
