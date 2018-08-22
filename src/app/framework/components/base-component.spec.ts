import { FormGroup, FormBuilder } from '@angular/forms';
import { BaseComponent } from './base-component';
import { IServerError } from '../validation/models/server-error.models';
import { TestInjector } from '../../demo-common/testing/testing-helpers';

const serverError = {
    details: [
        {
            code: 1,
            message: 'Field Error',
            target: 'fieldName'
        }
    ],
    code: 1,
    message: 'Test Error',
    target: 'field'
};

class TestBaseComponent extends BaseComponent {
    populateErrors(error: IServerError, form?: FormGroup) {
        return super.populateErrors(error, form);
    }
}

describe('BaseComponent', () => {
    let component: TestBaseComponent;
    beforeAll(() => {
        TestInjector.setInjector();
    });

    beforeEach(() => {
        component = new TestBaseComponent();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('can populate error with no form', () => {
        const errorList = component.populateErrors(serverError);
        expect(errorList[0]).toBe('Test Error');
        expect(errorList[1]).toBe('Field Error');
    });

    it('can associate a field-level error with a field on a form', () => {
        const formBuilder = new FormBuilder();
        const form = formBuilder.group({
            fieldName: ['', []]
        });
        const errorList = component.populateErrors(serverError, form);
        const control = form.get('fieldName');
        expect(control.errors['serverValidationError']).toBe('Field Error');
    });

    it('can assign error with missing field as a model error', () => {
        const formBuilder = new FormBuilder();
        const form = formBuilder.group({
            fieldName2: ['', []]
        });
        const errorList = component.populateErrors(serverError, form);
        expect(errorList[0]).toBe('Test Error');
    });
});
