import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../../framework/components/base-component';
import { IPartsDataTableColumn } from '../../../framework/directives/parts-data-table/parts-data-table-models';
import { IAccountSearchResult } from '../../../demo-common/models/account-search-result.models';
import { UserSessionService } from '../../../demo-common/services/user-session.service';

@Component({
    selector: 'la-search-results',
    templateUrl: './search-results.component.html',
    styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent extends BaseComponent implements OnInit, OnDestroy {

    searchResultList: Array<IAccountSearchResult> = [];

    searchResultColumns: Array<IPartsDataTableColumn> = [
        { name: 'accountCode', header: 'Account Code', sortable: true, dataType: 'url', width: '9%',
          link: 'accounts/:accountCode' },
        { name: 'accountName', header: 'Account Name', sortable: true, dataType: 'url', width: '33%',
          link: 'accounts/:accountCode' },
        { name: 'accountType', header: 'Account Type', sortable: true, width: '9%' },
        { name: 'accountStatusDisplay', header: 'Status', sortable: true, width: '8%', excludeFromGlobalFilter: true }
      ];

    errorsFromServer: Array<string> = [];

    constructor(private route: ActivatedRoute,
                private userSessionService: UserSessionService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();

        this.eventSubscriptions.push(this.route.data
            .subscribe((data: { searchResults: Array<IAccountSearchResult> }) => {
                this.errorsFromServer = [];
                if (this.userSessionService.navigationError) {
                    this.errorsFromServer =
                        this.errorUtilitiesService.parseNavigationError(this.userSessionService.navigationError);
                        this.userSessionService.navigationError = null;
                }
                if (data.searchResults) {
                    this.searchResultList = data.searchResults;
                } else {
                    this.searchResultList = [];
                }
            }));
    }
}
