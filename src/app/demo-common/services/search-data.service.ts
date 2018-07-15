import { Injectable } from '@angular/core';
import { IAccountSearchResult } from '../models/account-search-result.models';
import { DemoCommonDataService } from './demo-common-data.service';

@Injectable()
export class SearchDataService extends DemoCommonDataService {

    getAccountSearchResults() {
        const endpoint = `${this.apiServer.rules}accounts/`;
        return this.get<Array<IAccountSearchResult>>(endpoint);
    }
}
