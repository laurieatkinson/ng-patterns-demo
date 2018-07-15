import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { UserSessionService } from '../../../../../demo-common/services/user-session.service';
import { IAccount } from '../../models/account.models';
import { AccountDataService } from '../../services/account-data.service';
import { AccountHeaderService } from './account-header.service';
import { UtilitiesService } from '../../../../../framework/services/utilities.service';

describe('AccountHeaderService', () => {

    const account = {
        accountName: 'Test Account'
    };
    let service: AccountHeaderService;

    class MockAccountDataService {
        currentAccount = {
            accountCode: 'ABC123',
            accountName: 'Test Account',
            accountType: 'Personal',
            accountStatus: 'Active'
        };
        accountChanged = Observable.of();
        userSelectedAnotherAccount(): boolean {
            return false;
        }
        getAccount(): Promise<IAccount> {
            return new Promise<IAccount>((resolve) => {
                resolve(<IAccount>account);
            });
        }
        userUpdatedPlanName(name: string) {
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AccountHeaderService,
                UserSessionService,
                UtilitiesService,
                {
                    provide: AccountDataService,
                    useClass: MockAccountDataService
                }
            ]
        });
    });

    beforeEach(inject([AccountHeaderService], (s: AccountHeaderService) => {
        service = s;
    }));

    it('should create the service', () => {
        expect(service).toBeTruthy();
    });

    it('can initialize', () => {
        service.initialize();
    });

    it('can initialize with same account selected', () => {
        service.initialize().then((currentAccount) => {
            expect(currentAccount.accountName).toBe(account.accountName);
        }).catch(error => {
            expect(error).toBeNull();
        });
    });

    it('can update account name', () => {
        service.initialize().then((currentAccount) => {
            service.updateAccountName('new name');
            expect(service.accountName).toBe('new name');
        }).catch(error => {
            expect(error).toBeNull();
        });
    });

    it('can initialize with another account selected',
        inject([AccountDataService], (accountDataService: AccountDataService) => {
        spyOn(accountDataService, 'userSelectedAnotherAccount')
            .and.returnValue(true);
        spyOn(service, 'accountChanged');
        service.initialize().then((currentAccount) => {
            accountDataService.accountChanged.subscribe(() => {
                expect(service.accountChanged).toHaveBeenCalled();
            });
        }).catch(error => {
            expect(error).toBeNull();
        });
    }));
});
