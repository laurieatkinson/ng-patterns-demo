import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { IAccountSearchResult } from '../../../demo-common/models/account-search-result.models';
import { DemoResolver } from '../../../demo-common/services/demo-resolver.service';
import { SearchService } from '../../../demo-common/services/search.service';

@Injectable()
export class SearchResultsResolver extends DemoResolver
                                   implements Resolve<Array<IAccountSearchResult>> {

    constructor(private searchService: SearchService) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot) {
        super.resolve(route);
        return this.searchService.getAccounts();
    }
}
