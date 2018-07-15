import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReflectiveInjector, Type, TypeProvider, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/combineLatest';
import { AppInjector } from '../../app-injector.service';
import { PostingEntityDataService } from '../services/posting-entity-data.service';
import { PartsLoggingService } from '../../framework/logging/parts-logging.service';
import { AuthorizationService } from '../../framework/services/authorization.service';
import { PlanUpdateService } from '../../demo/accounts/shared/services/plan-update.service';
import { AccountDataService } from '../../demo/accounts/shared/services/account-data.service';
import { SystemMessageService } from '../../framework/services/system-message.service';
import { UserSessionService } from '../services/user-session.service';
import { PartsFormBuilderService } from '../../framework/services/parts-form-builder.service';
import { PostingService } from '../services/posting.service';
import { GlobalEventsService } from '../../framework/services/global-events.service';
import { ErrorUtilitiesService } from '../../framework/errorhandling/error-utilities.service';
import { IAccountTransactionObject, IEntity } from '../models/postings.models';
import { IPartsFormControl, IPartsListChoice } from '../../framework/models/form-controls.models';
import { IAccount } from '../../demo/accounts/shared/models/account.models';
import { UtilitiesService } from '../../framework/services/utilities.service';
import { DataService } from '../../framework/services/data.service';
import { PartsValidationService } from '../../framework/validation/services/parts-validation.service';
import { AuthService } from '../../framework/services/auth.service';

const mockPostingObject: IAccountTransactionObject = {
    accountCode: 'XYZ123',
    accountName: 'Account Name Here',
    transactionId: 2132,
    description: 'Mock Data Description'
};

export class MockActivatedRoute extends ActivatedRoute {
    params = Observable.of({
    });
}

export class MockLoggingService {
    logPageView() {
    }
    logException(exception: Error) {
    }
}

export class MockPostingService {
    currentPostId1 = '';
    private postingCommittedSource = new Subject<string>();
    postingCommitted = this.postingCommittedSource.asObservable();
    commitPosting() {
        return new Promise<string>((resolve) => {
            this.currentPostId1 = '';
            this.postingCommittedSource.next();
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
    getPostingIdentifier() {
        return Promise.resolve(this.currentPostId1);
    }
    getPostingObject() {
        const promise = new Promise<IAccountTransactionObject>((resolve, reject) => {
            resolve(mockPostingObject);
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

export class MockAppConfig {
    static settings = {
        env: {
            name: ''
        },
        aad: {},
        apiServer: {
            metadata: '',
            planRule: '',
            posting: '',
        },
        appInsights: {},
        logging: {}
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

export class MockPostingEntityDataService extends PostingEntityDataService {

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

export class MockPartsFormBuilderService {
    buildModelDrivenForm(formGroup: FormGroup, formControls: IPartsFormControl[],
        partsValidationService: PartsValidationService,
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

export class MockPartsValidationService extends PartsValidationService {
    applyValidationRules() {
        return Promise.resolve([]);
    }
}

export class MockPlanUpdateService {

    add<T>(dataService: PostingEntityDataService, postingEntity: IEntity) {
        return new Promise<IEntity>((resolve) => {
            resolve(postingEntity);
        });
    }

    update<T>(dataService: PostingEntityDataService, postingEntity: IEntity) {
        return new Promise<IEntity>((resolve) => {
            postingEntity.transactionIdentifier.id = -1;
            resolve(postingEntity);
        });
    }

    updateArray<T>(dataService: PostingEntityDataService, entities: Array<IEntity>) {
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

    getTooltip(fieldName: string, component: string) {
        return 'tooltip';
    }

    getTooltipsForComponent(componentName: string) {
        return Promise.resolve();
    }
}

class MockLocation {
    back() {
    }
}

const defaultProviders: Array<any> = [
    FormBuilder,
    PartsFormBuilderService,
    { provide: HttpClient, useClass: MockHttpClient },
    { provide: AuthService, useClass: MockAuthService },
    { provide: DataService, useClass: MockDataService },
    { provide: Router, useClass: MockRouter },
    { provide: AccountDataService, useClass: MockAccountDataService },
    { provide: SystemMessageService, useClass: MockSystemMessageService },
    { provide: UtilitiesService, useClass: UtilitiesService },
    { provide: ErrorUtilitiesService, useClass: ErrorUtilitiesService },
    { provide: GlobalEventsService, useClass: GlobalEventsService },
    { provide: PostingService, useClass: MockPostingService },
    { provide: PartsValidationService, useClass: MockPartsValidationService },
    { provide: UserSessionService, useClass: MockUserSessionService },
    { provide: PlanUpdateService, useClass: MockPlanUpdateService },
    { provide: AuthorizationService, useClass: MockAuthorizationService },
    { provide: PartsLoggingService, useClass: MockLoggingService },
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
