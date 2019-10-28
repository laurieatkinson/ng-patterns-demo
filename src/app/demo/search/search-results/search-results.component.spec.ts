import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../demo-common/services/search.service';
import { UserSessionService } from '../../../demo-common/services/user-session.service';
import { SearchResultsComponent } from './search-results.component';
import { of } from 'rxjs';
import { IAccountSearchResult } from '../../../demo-common/models/account-search-result.models';
import { TestInjector } from '../../../demo-common/testing/testing-helpers';

const searchResults = [{
    accountCode: 'ABC123',
    accountName: 'Test Account',
    accountType: ''
},
{
    accountCode: 'ABC234',
    accountName: 'Test Account2',
    accountType: ''
}
];

class MockActivatedRoute extends ActivatedRoute {
    data = of({ searchResults: searchResults });
}

class MockSearchService {
    getAccounts(): Promise<Array<IAccountSearchResult>> {
        return new Promise<Array<IAccountSearchResult>>((resolve) => {
            resolve(<Array<IAccountSearchResult>>searchResults);
        });
    }
}

describe('SearchResultsComponent', () => {
    let component: SearchResultsComponent;

    beforeAll(() => {
        TestInjector.setInjector([
            { provide: SearchService, useClass: MockSearchService }
        ]);
    });
    beforeEach(() => {
      component = new SearchResultsComponent(
        new MockActivatedRoute(),
        TestInjector.getService(UserSessionService));
      component.ngOnInit();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should get all accounts by default', () => {
        expect(component.searchResultList.length).toBe(2);
    });
});
