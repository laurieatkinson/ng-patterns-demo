import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { UserSessionService } from '../../../../../demo-common/services/user-session.service';
import { TestInjector, MockUserSessionService, MockActivatedRoute } from '../../../../../demo-common/testing/testing-helpers';
import { AccountHeaderComponent } from './account-header.component';
import { AccountHeaderService } from './account-header.service';
import { IAccount } from '../../models/account.models';
import { TransactionService } from '../../../../../demo-common/services/transaction.service';
import { GlobalEventsService } from '../../../../../framework/services/global-events.service';

const account = {
    accountCode: 'ABC123',
    accountName: 'Test Account'
};

class MockAccountDataService {
    currentAccount = {
        accountCode: 'ABC123',
        accountName: 'Test Account',
        accountType: 'Personal',
        accountStatus: 'Active'
    };
    accountChanged = of();
    userSelectedAnotherAccount(): boolean {
        return false;
    }
    getAccount(): Promise<IAccount> {
        return new Promise<IAccount>((resolve) => {
            resolve(<IAccount>account);
        });
    }
    userUpdatedAccountName(name1: string, name2: string, name3: string) {
    }
}

describe('AccountHeaderComponent', () => {
    let component: AccountHeaderComponent;
    beforeAll(() => {
        TestInjector.setInjector();
    });

    beforeEach(() => {
        component = new AccountHeaderComponent(
            TestInjector.getService(Router),
            new MockActivatedRoute(),
            new AccountHeaderService(<any>new MockAccountDataService(), new MockUserSessionService()),
            TestInjector.getService(TransactionService),
            TestInjector.getService(UserSessionService),
            TestInjector.getService(GlobalEventsService));
    });

    it('should be created', async(() => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    }));

    it('can show account name in header', async(() => {
        component.ngOnInit();
        expect(component.topHeader).toContain('Test Account');
    }));
});
