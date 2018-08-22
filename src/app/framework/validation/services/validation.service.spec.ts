import { FormBuilder, FormControl } from '@angular/forms';
import { async } from '@angular/core/testing';
import { ControlValidators } from '../directives/control-validators.directive';
import { TestInjector, MockTransactionEntityDataService } from '../../../demo-common/testing/testing-helpers';
import { IPartsFormControl } from '../../models/form-controls.models';
import { FormBuilderService } from '../../services/form-builder.service';
import { TransactionEntityDataService } from '../../../demo-common/services/transaction-entity-data.service';
import { ValidationService } from './validation.service';

const formControls: Array<IPartsFormControl> = [
    { name: 'name1' },
    { name: 'name2' },
    { name: 'accountID' },
    { name: 'testDate' },
    { name: 'terms', controls: [
        { name: 'minTerm' },
        { name: 'maxTerm' }
    ]},
    { name: 'sampleList[]', controls: [
        { name: 'code' },
        { name: 'longName' },
        { name: 'shortName' },
    ]},
    { name: 'accountFees', controls: [
        { name: 'fees[]', controls: [
            { name: 'tierFrom' },
            { name: 'tierTo' }
        ]},
        { name: 'testFees[]', controls: [
            { name: 'tierFrom' },
            { name: 'tierTo' }
        ]},
    ]}
];

const validationResponse = {
    properties: [
        {
            fieldName: 'name1',
            rules: [{
                type: 'requiredValidator',
                requiredValidator: {
                    errorMessage: 'Required'
                }
            },
            {
                type: 'maxLengthValidator',
                maxLengthValidator: {
                    maxLength: 30,
                    errorMessage: 'Value should be no more than 30 characters'
                }
            }]
        },
        {
            fieldName: 'name2',
            rules: [{
                type: 'maxLengthValidator',
                maxLengthValidator: {
                    maxLength: 30,
                    errorMessage: 'Value should be no more than 30 characters'
                }
            }]
        },
        {
            fieldName: 'accountID',
            rules: [{
                type: 'numberValidator',
                numberValidator: {
                    errorMessage: 'Value should be a number'
                }
            },
            {
                type: 'maxLengthValidator',
                maxLengthValidator: {
                    maxLength: 3,
                    errorMessage: 'Value should be no more than 3 characters'
                }
            }]
        },
        {
            fieldName: 'terms_minTerm',
            rules: [{
                type: 'numericMinValueValidator',
                numericMinValueValidator: {
                    minValue: 0,
                    inclusive: true,
                    errorMessage: 'Value must be greater than 0'
                }
            },
            {
                type: 'numericMaxValueValidator',
                numericMaxValueValidator: {
                    maxValue: 100,
                    inclusive: true,
                    errorMessage: 'Value must be less than 100'
                }
            }]
        },
        {
            fieldName: 'terms_maxTerm',
            rules: [{
                type: 'numericRangeValidator',
                numericRangeValidator: {
                    minValue: 0,
                    maxValue: 100,
                    inclusive: true,
                    errorMessage: 'Value must be between 0 and 100'
                }
            }]
        },
        {
            fieldName: 'testDate',
            rules: [{
                type: 'dateMinValueValidator',
                dateMinValueValidator: {
                    minValue: new Date(2001, 1, 1),
                    inclusive: true,
                    errorMessage: 'Value must be greater than 1/1/2001'
                }
            },
            {
                type: 'dateMaxValueValidator',
                dateMaxValueValidator: {
                    maxValue: new Date(2010, 12, 31),
                    inclusive: true,
                    errorMessage: 'Value must be less than 12/31/2010'
                }
            }]
        }
    ]
};

export class MockClientHintDataService extends MockTransactionEntityDataService {
    put() {
        return Promise.resolve(validationResponse);
    }
    endpoint() {
        return 'api-path';
    }
}

describe('ValidationService', () => {
    let service: ValidationService;
    beforeAll(() => {
        TestInjector.setInjector([
            { provide: ValidationService, useClass: ValidationService },
            { provide: TransactionEntityDataService, useClass: MockClientHintDataService }
        ]);
        service = TestInjector.getService(ValidationService);
    });

    it('should create the service', () => {
        expect(service).toBeTruthy();
    });

    it('should apply client-only validation rule', () => {
        const formBuilder = TestInjector.getService(FormBuilder);
        const formGroup = formBuilder.group({});
        const control = new FormControl({
            value: '',
            disabled: false
        });
        control.markAsPristine();
        formGroup.addControl('field1', control);

        service.applyClientOnlyValidationRule(formGroup, 'field1',
            [ControlValidators.requiredValidator('field1 is required')], null);
        control.updateValueAndValidity();
        expect(control.valid).toBe(false);
        control.setValue('test');
        expect(control.valid).toBe(true);
    });

    it('should apply client-only validation rule with warning', () => {
        const formBuilder = TestInjector.getService(FormBuilder);
        const formGroup = formBuilder.group({});
        const control = new FormControl({
            value: '',
            disabled: false
        });
        control.markAsPristine();
        formGroup.addControl('field1', control);

        service.applyClientOnlyValidationRule(formGroup, 'field1',
            [ControlValidators.requiredValidator('field1 is required')], null,
            ['requiredValidator']);
        control.updateValueAndValidity();
        expect((<any>control).warnings[0]).toBe('requiredValidator');
    });

    it('should append client-only validation rule to existing rule', () => {
        const formBuilder = TestInjector.getService(FormBuilder);
        const formGroup = formBuilder.group({});
        const control = new FormControl({
            value: '',
            disabled: false
        });
        control.markAsPristine();
        formGroup.addControl('field1', control);

        const validators = service.applyClientOnlyValidationRule(formGroup, 'field1',
            [ControlValidators.requiredValidator('field1 is required')], null);
        service.applyClientOnlyValidationRule(formGroup, 'field1',
            [ControlValidators.maxLengthValidator(10, 'field1 is too long')],
            [validators]);

        control.updateValueAndValidity();
        expect(control.valid).toBe(false);
        control.setValue('test');
        expect(control.valid).toBe(true);
        control.setValue('test1234567890');
        expect(control.valid).toBe(false);
    });

    it('can apply validation rules to form', async(() => {
        const formBuilderService = TestInjector.getService(FormBuilderService);
        const formBuilder = TestInjector.getService(FormBuilder);
        const formGroup = formBuilder.group({});
        const dataService = TestInjector.getService(TransactionEntityDataService);
        formBuilderService.buildModelDrivenForm(formGroup, formControls, service, <any>dataService, '').then(validators => {
            expect(validators.length).toBeGreaterThan(0);
        });
    }));

    it('can apply validation rule to nested control in client hints', async(() => {
        const formBuilderService = TestInjector.getService(FormBuilderService);
        const formBuilder = TestInjector.getService(FormBuilder);
        const formGroup = formBuilder.group({});
        const dataService = TestInjector.getService(TransactionEntityDataService);
        formBuilderService.buildModelDrivenForm(formGroup, formControls, service, <any>dataService, '').then(validators => {
            const testControl = formGroup.get('terms.minTerm');
            const validator = validators.find(controlValidator => {
                return controlValidator.control === testControl;
            });
            expect(validator.validators.length).toBe(2);
        });
    }));

    it('can apply date validation rules in client hints', async(() => {
        const formBuilderService = TestInjector.getService(FormBuilderService);
        const formBuilder = TestInjector.getService(FormBuilder);
        const formGroup = formBuilder.group({});
        const dataService = TestInjector.getService(TransactionEntityDataService);
        formBuilderService.buildModelDrivenForm(formGroup, formControls, service, <any>dataService, '').then(validators => {
            const testControl = formGroup.get('testDate');
            const validator = validators.find(controlValidator => {
                return controlValidator.control === testControl;
            });
            expect(validator.validators.length).toBe(2);
        });
    }));
});
