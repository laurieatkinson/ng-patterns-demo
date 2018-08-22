import { Injectable } from '@angular/core';
import { IAccountSearchResult } from '../models/account-search-result.models';
import { SearchDataService } from './search-data.service';
import { IChild1Entity } from '../../demo/accounts/shared/models/child1-entity.models';

@Injectable()
export class SearchService {

    private accounts: Array<IAccountSearchResult> = [];

    constructor(private searchDataService: SearchDataService) {
        this.accounts = [];
    }

    getAccounts() {
        return this._getAccounts();
    }

    accountUpdated(child1: IChild1Entity) {
        this.updateList(this.accounts, child1);
    }

    private updateList(accountList: IAccountSearchResult[], child1: IChild1Entity) {
        // Find the saved account in the search results list
        const index = accountList.findIndex(p => {
            return p.accountCode === child1.accountCode;
        });

        // If found, update the name if that was changed
        if (index !== -1) {
            accountList[index].accountName = child1.name1;
        }
    }

    private _getAccounts() {
        const promise = new Promise<IAccountSearchResult[]>((resolve, reject) => {
            if (this.accounts.length > 0) {
                resolve(this.accounts);
            } else {
                this.searchDataService.getAccountSearchResults()
                    .then(accounts => {
                        accounts.forEach(item => {
                            item.accountStatusDisplay = item.accountStatus === 1 ? 'Active' : 'Inactive';
                        });
                        this.accounts = accounts;
                        resolve(accounts);
                    }).catch((e) => {
                        reject(e);
                    });
            }
        });
        return promise;
    }
}
