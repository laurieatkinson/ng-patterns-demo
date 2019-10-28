import { async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { UtilitiesService } from '../../../framework/services/utilities.service';
import { TestInjector } from '../../../demo-common/testing/testing-helpers';
import { IChild1Entity } from '../shared/models/child1-entity.models';
import { ChildComponent1Component } from './child-component1.component';

const child1: IChild1Entity = {
    transactionIdentifier: {
        id: 0,
    },
    accountCode: 'ABC123',
    name1: 'ABC Account',
    name2: '',
    name3: '',
    product: '',
    accountStatus: 'Active',
    accountType: '',
    addressLine1: '690 Canton Street',
    addressLine2: '',
    addressLine3: '',
    city: 'Westwood',
    state: 'MA',
    zip: '02090',
    startDate: new Date('04/22/1999'),
    lastModifiedDate: new Date('04/22/1999'),
    statusCodeList: [],
    productCodeList: [],
    stateCodeList: [],
    accountTypeList: []
};

// class MockSearchService {
//     accountUpdated(entity: IChild1Entity) { }
// }

class MockActivatedRoute extends ActivatedRoute {
    data = of({
        child1: UtilitiesService.cloneDeep(child1)
    });
}

const mockChild1DataService = jasmine.createSpyObj(
    'Child1DataService', ['getChild1']);

    mockChild1DataService.getChild1.and.returnValue(
    new Promise<IChild1Entity>((resolve) => {
    resolve(child1);
}));

const mockSearchService = jasmine.createSpyObj(
    'SearchDataService', ['accountUpdated']);

mockSearchService.accountUpdated.and.returnValue(
    new Promise<void>((resolve) => {
        resolve();
}));

const mockAccountHeaderService = jasmine.createSpyObj(
    'AccountHeaderService', ['updateAccountName']);

// class MockAccountHeaderService {
//     updateAccountName(name: string): void {
//     }
// }

describe('ChildComponent1Component', () => {
    let component: ChildComponent1Component;
    beforeAll(() => {
        TestInjector.setInjector();
    });

    beforeEach(() => {
        component = new ChildComponent1Component(
            new MockActivatedRoute(), mockSearchService,
            mockAccountHeaderService,
            mockChild1DataService);
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
