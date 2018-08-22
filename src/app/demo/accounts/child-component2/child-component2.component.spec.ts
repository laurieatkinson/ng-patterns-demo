import { ActivatedRoute } from '@angular/router';
import { async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { TestInjector } from '../../../demo-common/testing/testing-helpers';
import { ChildComponent2Component } from './child-component2.component';
import { IChild2Entity } from '../shared/models/child2-entity.models';

const child2: IChild2Entity = {
    transactionIdentifier: null,
    name1: 'Account Name',
    name2: '',
    name3: '',
    accountType: 'Account Type',
    contactName: 'Contact Name',
    contactPhoneNumber: '123-1234',
    contactPhoneAreaCode: '303',
    rate: null,
    accountTypeList: []
};

class MockActivatedRoute extends ActivatedRoute {
    data = Observable.of({
      child2: child2
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
        component.form.get('contactName').setValue('John Doe');
        component.save().then(() => {
            expect(component.child2.contactName).toBe('John Doe');
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
      component.child2.rate = 50;
      expect(component.hasChanged()).toBe(true);
    });
    component.ngOnInit();
  }));
});
