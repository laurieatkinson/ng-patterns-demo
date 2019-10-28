import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReflectiveInjector, Type, TypeProvider, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { AppInjector } from '../../app-injector.service';
import { TransactionEntityDataService } from '../services/transaction-entity-data.service';
import { LoggingService } from '../../framework/logging/logging.service';
import { AuthorizationService } from '../../framework/services/authorization.service';
import { UpdateService } from '../../demo/accounts/shared/services/update.service';
import { AccountDataService } from '../../demo/accounts/shared/services/account-data.service';
import { SystemMessageService } from '../../framework/services/system-message.service';
import { UserSessionService } from '../services/user-session.service';
import { FormBuilderService } from '../../framework/services/form-builder.service';
import { TransactionService } from '../services/transaction.service';
import { GlobalEventsService } from '../../framework/services/global-events.service';
import { ErrorUtilitiesService } from '../../framework/errorhandling/error-utilities.service';
import { IAccountTransactionObject, IEntity } from '../models/transaction.models';
import { IPartsFormControl, IPartsListChoice } from '../../framework/models/form-controls.models';
import { IAccount } from '../../demo/accounts/shared/models/account.models';
import { UtilitiesService } from '../../framework/services/utilities.service';
import { DataService } from '../../framework/services/data.service';
import { ValidationService } from '../../framework/validation/services/validation.service';
import { AuthService } from '../../framework/services/auth.service';
import { AppConfig } from '../../app.config';

const mockTransactionObject: IAccountTransactionObject = {
    accountCode: 'XYZ123',
    accountName: 'Account Name Here',
    transactionId: 2132,
    description: 'Mock Data Description'
};

export class MockActivatedRoute extends ActivatedRoute {
    params = of({
    });
}

export class MockLoggingService {
    logPageView() {
    }
    logException(exception: Error) {
    }
}

export class MockTransactionService {
    currentPostId1 = '';
    private transactionCommittedSource = new Subject<string>();
    transactionCommitted = this.transactionCommittedSource.asObservable();
    commitTransaction() {
        return new Promise<string>((resolve) => {
            this.currentPostId1 = '';
            this.transactionCommittedSource.next();
            resolve(this.currentPostId1);
        });
    }
    canCommit() { return true; }
    currentPostId() {
        return this.currentPostId1;
    }
    clearPostId() {
        this.currentPostId1 = '';
    }
    getTransactionIdentifier() {
        return Promise.resolve(this.currentPostId1);
    }
    getTransactionObject() {
        const promise = new Promise<IAccountTransactionObject>((resolve, reject) => {
            resolve(mockTransactionObject);
        });
        return promise;
    }
}

export class MockUserSessionService extends UserSessionService {
    constructor() {
        super(new UtilitiesService());
        this.accountCode = 'CF0102';
        this.transactionIdentifier = null;
        this.navigationError = null;
    }
}

export class MockAuthorizationService {
    hasPermission() {
        return true;
    }
}

export class MockAuthService {
    logIn() { }
    logOut() { }
}

export class MockAppConfig extends AppConfig {
    static settings = {
        env: {
            name: '',
            buildId: ''
        },
        aad: {
            requireAuth: true,
            tenant: '',
            resource: '',
            clientId: '',
            endpoints: {}
        },
        apiServer: {
            metadata: '',
            rules: '',
            transaction: '',
        },
        appInsights: {
            instrumentationKey: ''
        },
        logging: {
            console: true,
            appInsights: false,
            traceEnabled: false
        }
    };
}

export class MockDataService extends DataService {

    protected apiServer = {
        metadata: '',
        rules: '',
        transaction: '',
    };

    get<T>(url: string) {
        return Promise.resolve(null);
        }
    put<T>(url: string, body: any) {
        return Promise.resolve(null);
    }
    post<T>(url: string, body: any) {
        return Promise.resolve(null);
    }
    delete<T>(url: string, body: any) {
        return Promise.resolve(null);
    }
    endpoint() {
        return '';
    }
}

export class MockTransactionEntityDataService extends TransactionEntityDataService {

    protected apiServer = {
        metadata: '',
        rules: '',
        transaction: '',
    };

    get<T>(url: string) {
        return Promise.resolve(null);
        }
    put<T>(url: string, body: any) {
        return Promise.resolve(null);
    }
    post<T>(url: string, body: any) {
        return Promise.resolve(null);
    }
    delete<T>(url: string, body: any) {
        return Promise.resolve(null);
    }
    endpoint() {
        return '';
    }
}

export class MockMetadataService {
    getLookupList(name: string): Promise<IPartsListChoice[]> {
        return Promise.resolve([
            { value: '1', label: 'item 1' },
            { value: '2', label: 'item 2' },
            { value: '3', label: 'item 3' }
        ]);
    }
}

export class MockFormBuilderService {
    buildModelDrivenForm(formGroup: FormGroup, formControls: IPartsFormControl[],
        validationService: ValidationService,
        dataService: DataService, formGroupToValidate: string, ruleSet?: string) {

        formControls.forEach(control => {
            const newControl = new FormControl({
                value: control.defaultValue,
                disabled: false
            });
            newControl.markAsPristine();
            formGroup.addControl(control.name, newControl);
        });
        return Promise.resolve();
    }
}

export class MockValidationService extends ValidationService {
    applyValidationRules() {
        return Promise.resolve([]);
    }
}

export class MockUpdateService {

    add<T>(dataService: TransactionEntityDataService, entity: IEntity) {
        return new Promise<IEntity>((resolve) => {
            resolve(entity);
        });
    }

    update<T>(dataService: TransactionEntityDataService, entity: IEntity) {
        return new Promise<IEntity>((resolve) => {
            entity.transactionIdentifier.id = -1;
            resolve(entity);
        });
    }

    updateArray<T>(dataService: TransactionEntityDataService, entities: Array<IEntity>) {
        return new Promise<Array<IEntity>>((resolve) => {
            entities[0].transactionIdentifier.id = -1;
            resolve(entities);
        });
    }
}

export class MockAccountDataService {
    currentAccount = {
        accountCode: 'TEST',
        name1: 'Test Account',
        name2: '',
        name3: ''
    };

    getAccount(): Promise<IAccount> {
        return new Promise<IAccount>((resolve) => {
            resolve(<IAccount>{
                accountName: 'Test Account',
                accountCode: 'TEST'
            });
        });
    }

    userSelectedAnotherAccount() {
        return false;
    }
}

export class MockRouter {
    url = 'accounts/CF0102';
    navigate() {
        Promise.resolve(true);
    }
    navigateByUrl(url: string) {
        Promise.resolve(true);
    }
}

export class MockNgControl {
    control = {};
    errors = {};
}

export class MockHttpClient { }

export class MockElementRef extends ElementRef {
    constructor() { super(null); }
}

export class MockSystemMessageService {
    getMessage(id: number, errorParameters?: Array<string>) {
        return 'Error message';
    }
}

class MockLocation {
    back() {
    }
}

const defaultProviders: Array<any> = [
    FormBuilder,
    FormBuilderService,
    { provide: HttpClient, useClass: MockHttpClient },
    { provide: AuthService, useClass: MockAuthService },
    { provide: DataService, useClass: MockDataService },
    { provide: Router, useClass: MockRouter },
    { provide: AccountDataService, useClass: MockAccountDataService },
    { provide: SystemMessageService, useClass: MockSystemMessageService },
    { provide: UtilitiesService, useClass: UtilitiesService },
    { provide: ErrorUtilitiesService, useClass: ErrorUtilitiesService },
    { provide: GlobalEventsService, useClass: GlobalEventsService },
    { provide: TransactionService, useClass: MockTransactionService },
    { provide: ValidationService, useClass: MockValidationService },
    { provide: UserSessionService, useClass: MockUserSessionService },
    { provide: UpdateService, useClass: MockUpdateService },
    { provide: AuthorizationService, useClass: MockAuthorizationService },
    { provide: LoggingService, useClass: MockLoggingService },
    { provide: Location, useClass: MockLocation }
];

export class TestInjector {

    static setInjector(providers?: Array<{ provide: TypeProvider, useClass: any } | any>) {
        let injector: ReflectiveInjector;
        if (!providers) {
            injector = ReflectiveInjector.resolveAndCreate(defaultProviders);
        } else {
            defaultProviders.forEach(defaultProvider => {
                if (providers.findIndex(item => {
                    return item.provide && item.provide === defaultProvider.provide;
                }) === -1) {
                    providers.push(defaultProvider);
                }
            });
            injector = ReflectiveInjector.resolveAndCreate(<any>providers);
        }
        AppInjector.getInstance().setInjector(injector);
        UtilitiesService.isToday = (date: Date) => {
            return true;
        };
    }
    static getService<T>(token: Type<T>) {
        return AppInjector.getInstance().getInjector().get(token);
    }
}
