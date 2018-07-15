import { TestBed, inject } from '@angular/core/testing';
import { IAccountSearchResult } from '../models/account-search-result.models';
import { SearchDataService } from './search-data.service';
import { SearchService } from './search.service';

const searchResults = [{
    accountCode: 'ABC123',
    accountName: 'Test Account 1',
    accountType: ''
},
{
    accountCode: 'ABC234',
    accountName: 'Test Account 2',
    accountType: ''
}
];

class MockSearchDataService {
    getAccountSearchResults(showInactive?: boolean): Promise<Array<IAccountSearchResult>> {
        return new Promise<Array<IAccountSearchResult>>((resolve) => {
            resolve(<Array<IAccountSearchResult>>searchResults);
        });
    }
}

describe('SearchService', () => {

    let service: SearchService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SearchService,
                {
                    provide: SearchDataService,
                    useClass: MockSearchDataService
                }
            ]
        });
    });

    beforeEach(inject([SearchService], (s: SearchService) => {
        service = s;
    }));

    it('should create the service', () => {
        expect(service).toBeTruthy();
    });

    it('can get accounts', () => {
        service.getAccounts().then(accounts => {
            expect(accounts.length).toBe(2);
        }).catch(error => {
            expect(error).toBeNull();
        });
    });
});
