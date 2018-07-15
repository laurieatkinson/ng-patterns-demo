import { async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UtilitiesService } from '../../../framework/services/utilities.service';
import { TestInjector } from '../../../demo-common/testing/testing-helpers';
import { IChild1Entity } from '../shared/models/child1-entity.models';
import { ChildComponent1Component } from './child-component1.component';

const child1: IChild1Entity = {
    transactionIdentifier: {
        id: 0,
    },
    asOfDate: new Date(),
    accountCode: 'ABC123',
    name1: 'ABC Account',
    name2: '',
    name3: '',
    planStatus: 'AC',
    planType: '',
    industryCode: 'BFSI',
    trustID: 'AL-2102',
    topHeavyCode: '1',
    product: '',
    trustCustodianRelation: 1,
    supressSSN: false,
    nonERISAPlan: false,
    overridePlanInfo: false,
    inceptionDate: new Date(),
    addedDate: new Date(),
    removedDate: null,
    lastAmendmentDate: null,
    repaperedDate: new Date(),
    addressLine1: '690 Canton Street',
    addressLine2: '',
    addressLine3: '',
    city: 'Westwood',
    state: 'MA',
    zip: '02090',
    country: '',
    planStatusCodeList: [],
    topHeavyCodeList: [],
    ProductCodeList: [],
    PlanRelationshipCodeList: [],
    industryCodeList: [],
    stateCodeList: []
};

class MockSearchService {
    planUpdated(plan: IChild1Entity) { }
}

class MockActivatedRoute extends ActivatedRoute {
    data = Observable.of({
        plan: UtilitiesService.cloneDeep(child1)
    });
}

const mockBasicInfoDataService = jasmine.createSpyObj(
    'BasicInfoDataService', ['getPlan']);

mockBasicInfoDataService.getPlan.and.returnValue(
    new Promise<IChild1Entity>((resolve) => {
    resolve(child1);
}));

const mockSearchService = jasmine.createSpyObj(
    'BasicInfoDataService', ['planUpdated']);

mockSearchService.planUpdated.and.returnValue(
    new Promise<void>((resolve) => {
        resolve();
}));

const mockPlanHeaderService = jasmine.createSpyObj(
    'PlanHeaderService', ['updatePlanName']);

class MockPlanHeaderService {
    updatePlanName(name1: string, name2: string, name3: string): void {
    }
}

describe('PlanBasicInfoComponent', () => {
    let component: ChildComponent1Component;
    beforeAll(() => {
        TestInjector.setInjector();
    });

    beforeEach(() => {
        component = new ChildComponent1Component(
            new MockActivatedRoute(), mockSearchService,
            mockPlanHeaderService,
            mockBasicInfoDataService);
    });
    it('should be created', async(() => {
        component.componentLoadingComplete.subscribe(() => {
            expect(component).toBeTruthy();
        });
        component.ngOnInit();
    }));

    it('can toggle edit mode', async(() => {
        component.componentLoadingComplete.subscribe(() => {
            component.toggleEditMode(true);
            expect(component.editMode).toBe(true);
        });
        component.ngOnInit();
    }));

    it('can save child1', async(() => {
        component.componentLoadingComplete.subscribe(() => {
            component.toggleEditMode(true);
            component.child1.addressLine1 = '690 Canton st';
            component.save().then(() => {
                expect(component.child1.addressLine1).toEqual('690 Canton st');
            });
        });
        component.ngOnInit();
    }));

    it('can undo edit of child1', async(() => {
        component.componentLoadingComplete.subscribe(() => {
            component.toggleEditMode(true);
            component.child1.addressLine1 = '690 Canton st';
            component.toggleEditMode(false);
            expect(component.child1.addressLine1).toEqual('690 Canton Street');
        });
        component.ngOnInit();
    }));
});
