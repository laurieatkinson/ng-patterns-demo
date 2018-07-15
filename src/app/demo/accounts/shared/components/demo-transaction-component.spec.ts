import { ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { Validators } from '@angular/forms';
import { async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { UtilitiesService } from '../../../../framework/services/utilities.service';
import { IEntity } from '../../../../demo-common/models/postings.models';
import { IPartsFormControl } from '../../../../framework/models/form-controls.models';

import { TestInjector } from '../../../../demo-common/testing/testing-helpers';
import { DemoTransactionComponent } from './demo-transaction-component';

interface ITestEntity extends IEntity {
    field1: string;
    field2: {
        subField1: string;
    };
}
const testEntity: ITestEntity = {
    transactionIdentifier: null,
    field1: 'test',
    field2: {
        subField1: 'sub1'
    }
};

class MockActivatedRoute {
    data = Observable.of({
        testEntity: {
            transactionIdentifier: null,
            field1: 'test',
            field2: {
                subField1: 'sub1'
            }
        }
    });
}

class TestDemoTransactionComponent extends DemoTransactionComponent {
    routeParamName = 'testEntity';
    testOriginal: ITestEntity;
    testEntity: ITestEntity = UtilitiesService.cloneDeep(testEntity);
    formControls: Array<IPartsFormControl> = [
        { 'name': 'field1', 'defaultValue': '' }
    ];

    constructor() {
        super(<any>(new MockActivatedRoute()));
    }

    get original() {
        return this.testOriginal;
    }

    set original(value: ITestEntity) {
        this.testOriginal = value;
    }

    get postingEntity() {
        return this.testEntity;
    }

    set postingEntity(value: ITestEntity) {
        this.testEntity = value;
    }

    hasChanged() {
        return super.hasChanged();
    }
    navigatingAwayFromParent(nextState?: RouterStateSnapshot) {
        return super.navigatingAwayFromParent(nextState);
    }
}

describe('DemoTransactionComponent', () => {
    let component: TestDemoTransactionComponent;
    beforeAll(() => {
        TestInjector.setInjector();
    });

    beforeEach(() => {
      component = new TestDemoTransactionComponent();
    });

    it('should create', async(() => {
        component.componentLoadingComplete.subscribe(() => {
            expect(component).toBeTruthy();
        });
        component.ngOnInit();
    }));

    it('initializes editMode to false', async(() => {
        component.componentLoadingComplete.subscribe(() => {
            expect(component.editMode).toBe(false);
        });
        component.ngOnInit();
    }));

    it('initializes postingEntity to data passed from route', async(() => {
        component.componentLoadingComplete.subscribe(() => {
            expect(component.postingEntity.field1).toBe('test');
        });
        component.ngOnInit();
    }));

    it('initializes original version of postingEntity', async(() => {
        component.componentLoadingComplete.subscribe(() => {
            component.postingEntity.field2 = {
                subField1: 'CHANGE'
            };
            expect(component.original.field2.subField1).toBe('sub1');
        });
        component.ngOnInit();
    }));

    it('hasChanged is false if nothing is changed', async(() => {
        component.componentLoadingComplete.subscribe(() => {
            expect(component.hasChanged()).toBe(false);
        });
        component.ngOnInit();
    }));

    it('should set hasChanged to true if a field is changed', async(() => {
        component.componentLoadingComplete.subscribe(() => {
            component.editMode = true;
            component.postingEntity.field1 = 'CHANGE';
            const result = component.hasChanged();
            expect(result).toBe(true);
        });
        component.ngOnInit();
    }));

    it('should set hasChanged back to false if a field is changed back', async(() => {
        component.componentLoadingComplete.subscribe(() => {
            component.editMode = true;
            component.postingEntity.field1 = 'CHANGE';
            component.postingEntity.field1 = 'test';
            expect(component.hasChanged()).toBe(false);
        });
        component.ngOnInit();
    }));

    it('can toggle edit mode to true', async(() => {
        component.componentLoadingComplete.subscribe(() => {
            component.toggleEditMode(true);
            expect(component.editMode).toBe(true);
        });
        component.ngOnInit();
    }));

    it('toggling edit mode to false resets to original', async(() => {
        component.componentLoadingComplete.subscribe(() => {
            component.toggleEditMode(true);
            component.postingEntity.field1 = 'after';
            component.toggleEditMode(false);
            expect(component.postingEntity.field1).toBe('test');
        });
        component.ngOnInit();
    }));

    it('can add client-only validator to form field', async(() => {
        component.componentLoadingComplete.subscribe(() => {
            component.addClientOnlyValidator('field1', [Validators.required]);
            component.form.controls['field1'].updateValueAndValidity();
            expect(component.form.controls['field1'].valid).toBe(true);
            component.form.controls['field1'].setValue('');
            component.form.controls['field1'].updateValueAndValidity();
            expect(component.form.controls['field1'].valid).toBe(false);
        });
        component.ngOnInit();
    }));

    it('can add client-only pattern validator to form field', async(() => {
        component.componentLoadingComplete.subscribe(() => {
            component.addClientOnlyValidator('field1', [Validators.pattern('\\d{3}')]);
            component.form.controls['field1'].setValue('123');
            component.form.controls['field1'].updateValueAndValidity();
            expect(component.form.controls['field1'].valid).toBe(true);
            component.form.controls['field1'].setValue('abc');
            component.form.controls['field1'].updateValueAndValidity();
            expect(component.form.controls['field1'].valid).toBe(false);
        });
        component.ngOnInit();
    }));
});
