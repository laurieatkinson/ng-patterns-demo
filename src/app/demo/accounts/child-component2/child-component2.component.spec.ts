import { ActivatedRoute } from '@angular/router';
import { async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { TestInjector } from '../../../demo-common/testing/testing-helpers';
import { ChildComponent2Component } from './child-component2.component';
import { IChild2Entity } from '../shared/models/child2-entity.models';

const child2: IChild2Entity = {
    accountCode: 'CF0102',
    transactionIdentifier: null,
    asOfDate: new Date(2017, 7, 15),
    outsidePlanName: 'Plan Name',
    outsidePlanType: 'Plan Type',
    outsideContactName: 'Contact Name',
    contactPhoneNumber: '123-1234',
    contactPhoneAreaCode: '303',
    outsidePlanName1: '',
    outsidePlanName2: '',
    outsidePlanName3: '',
    erOverrideContribRate: null,
    AccountTypeList: [],
};

class MockActivatedRoute extends ActivatedRoute {
    data = Observable.of({
      outsidePlan: child2
    });
}

const mockChild2DataService = jasmine.createSpyObj(
  'mockChild2DataService', ['getChild2']);

  mockChild2DataService.getChild2.and.returnValue(
  new Promise<IChild2Entity>((resolve) => {
      resolve(child2);
}));

describe('ChildComponent2Component', () => {
  let component: ChildComponent2Component;
  beforeAll(() => {
    TestInjector.setInjector();
  });

  beforeEach(() => {
      component = new ChildComponent2Component(
          new MockActivatedRoute(),
          mockChild2DataService);
  });

  it('should be created', async(() => {
    component.componentLoadingComplete.subscribe(() => {
        expect(component).toBeTruthy();
    });
    component.ngOnInit();
  }));

  it('should toggle edit mode', async(() => {
      component.componentLoadingComplete.subscribe(() => {
        component.toggleEditMode(true);
        expect(component.editMode).toBe(true);
      });
      component.ngOnInit();
  }));

  it('should save the results', async(() => {
      component.componentLoadingComplete.subscribe(() => {
        component.toggleEditMode(true);
        component.form.get('outsideContactName').setValue('John Doe');
        component.save().then(() => {
            expect(component.child2.outsideContactName).toBe('John Doe');
        });
      });
      component.ngOnInit();
  }));

  it('hasChanged is false if nothing is changed', async(() => {
    component.componentLoadingComplete.subscribe(() => {
        expect(component.hasChanged()).toBe(false);
    });
    component.ngOnInit();
  }));

  it('should set hasChanged to true if value is changed', async(() => {
    component.componentLoadingComplete.subscribe(() => {
      component.editMode = true;
      component.child2.erOverrideContribRate = 50;
      expect(component.hasChanged()).toBe(true);
    });
    component.ngOnInit();
  }));
});
