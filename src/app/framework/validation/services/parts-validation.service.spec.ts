import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { async } from '@angular/core/testing';
import { ControlValidators } from '../directives/control-validators.directive';
import { AppInjector } from '../../../app-injector.service';
import { TestInjector, MockPostingEntityDataService } from '../../../demo-common/testing/testing-helpers';
import { PartsValidationService } from './parts-validation.service';
import { PartsLoggingService } from '../../logging/parts-logging.service';
import { AuthService } from '../../services/auth.service';
import { UtilitiesService } from '../../services/utilities.service';
import { GlobalEventsService } from '../../services/global-events.service';
import { IPartsFormControl } from '../../models/form-controls.models';
import { PartsFormBuilderService } from '../../services/parts-form-builder.service';
import { PostingEntityDataService } from '../../../demo-common/services/posting-entity-data.service';

const formControls: Array<IPartsFormControl> = [
    { name: 'planGroup' },
    { name: 'name1' },
    { name: 'name2' },
    { name: 'planID' },
    { name: 'testDate' },
    { name: 'terms', controls: [
        { name: 'genMinTerm' },
        { name: 'genMaxTerm' },
        { name: 'resMinTerm' },
        { name: 'resMaxTerm' }
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
    code: {
        type: 'String',
        'properties': []
    },
    dto: {
        type: 'BasicInfoDTO',
        properties: [
            {
                name: 'planGroup',
                rules: [{
                    type: 'readOnly',
                    readOnly: {
                        clientHintName: 'readOnly',
                        errorMessage: 'The field is read-only'
                    }
                }]
            },
            {
                name: 'name1',
                rules: [{
                    type: 'requiredValidator',
                    requiredValidator: {
                        clientHintName: 'requiredValidator',
                        errorMessage: 'Required'
                    }
                },
                {
                    type: 'maxLengthValidator',
                    maxLengthValidator: {
                        clientHintName: 'maxLengthValidator',
                        maxLength: 30,
                        errorMessage: 'Value should be no more than 30 characters'
                    }
                }]
            },
            {
                name: 'name2',
                rules: [{
                    type: 'maxLengthValidator',
                    maxLengthValidator: {
                        clientHintName: 'maxLengthValidator',
                        maxLength: 30,
                        errorMessage: 'Value should be no more than 30 characters'
                    }
                }]
            },
            {
                name: 'planID',
                rules: [{
                    type: 'numberValidator',
                    numberValidator: {
                        clientHintName: 'numberValidator',
                        errorMessage: 'Value should be a number'
                    }
                },
                {
                    type: 'maxLengthValidator',
                    maxLengthValidator: {
                        clientHintName: 'maxLengthValidator',
                        maxLength: 3,
                        errorMessage: 'Value should be no more than 3 characters'
                    }
                }]
            },
            {
                name: 'terms_genMinTerm',
                rules: [{
                    type: 'numericMinValueValidator',
                    numericMinValueValidator: {
                        clientHintName: 'numericMinValueValidator',
                        minValue: 0,
                        inclusive: true,
                        errorMessage: 'Value must be greater than 0'
                    }
                },
                {
                    type: 'numericMaxValueValidator',
                    numericMaxValueValidator: {
                        clientHintName: 'numericMaxValueValidator',
                        maxValue: 100,
                        inclusive: true,
                        errorMessage: 'Value must be less than 100'
                    }
                }
            ]},
            {
                name: 'terms_genMaxTerm',
                rules: [{
                    type: 'numericRangeValidator',
                    numericRangeValidator: {
                        clientHintName: 'numericRangeValidator',
                        minValue: 0,
                        maxValue: 100,
                        inclusive: true,
                        errorMessage: 'Value must be between 0 and 100'
                    }
                }
            ]},
            {
                name: 'testDate',
                rules: [{
                    type: 'dateMinValueValidator',
                    dateMinValueValidator: {
                        clientHintName: 'dateMinValueValidator',
                        minValue: new Date(2001, 1, 1),
                        inclusive: true,
                        errorMessage: 'Value must be greater than 1/1/2001'
                    }
                },
                {
                    type: 'dateMaxValueValidator',
                    dateMaxValueValidator: {
                        clientHintName: 'dateMaxValueValidator',
                        maxValue: new Date(2010, 12, 31),
                        inclusive: true,
                        errorMessage: 'Value must be less than 12/31/2010'
                    }
                }
            ]}
        ]
    }
};

export class MockClientHintDataService extends MockPostingEntityDataService {

    put() {
        return Promise.resolve(validationResponse);
    }
    endpoint() {
        return 'api-path';
    }
}

describe('PartsValidationService', () => {
    let service: PartsValidationService;
    beforeAll(() => {
        TestInjector.setInjector([
            { provide: PartsValidationService, useClass: PartsValidationService },
            { provide: PostingEntityDataService, useClass: MockClientHintDataService }
        ]);
        service = TestInjector.getService(PartsValidationService);
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
        const partsFormBuilder = TestInjector.getService(PartsFormBuilderService);
        const formBuilder = TestInjector.getService(FormBuilder);
        const formGroup = formBuilder.group({});
        const dataService = TestInjector.getService(PostingEntityDataService);
        partsFormBuilder.buildModelDrivenForm(formGroup, formControls, service, <any>dataService, '').then(validators => {
            expect(validators.length).toBeGreaterThan(0);
        });
    }));

    it('can apply validation rule to nested control in client hints', async(() => {
        const partsFormBuilder = TestInjector.getService(PartsFormBuilderService);
        const formBuilder = TestInjector.getService(FormBuilder);
        const formGroup = formBuilder.group({});
        const dataService = TestInjector.getService(PostingEntityDataService);
        partsFormBuilder.buildModelDrivenForm(formGroup, formControls, service, <any>dataService, '').then(validators => {
            const testControl = formGroup.get('terms.genMinTerm');
            const validator = validators.find(controlValidator => {
                return controlValidator.control === testControl;
            });
            expect(validator.validators.length).toBe(2);
        });
    }));

    it('can apply date validation rules in client hints', async(() => {
        const partsFormBuilder = TestInjector.getService(PartsFormBuilderService);
        const formBuilder = TestInjector.getService(FormBuilder);
        const formGroup = formBuilder.group({});
        const dataService = TestInjector.getService(PostingEntityDataService);
        partsFormBuilder.buildModelDrivenForm(formGroup, formControls, service, <any>dataService, '').then(validators => {
            const testControl = formGroup.get('testDate');
            const validator = validators.find(controlValidator => {
                return controlValidator.control === testControl;
            });
            expect(validator.validators.length).toBe(2);
        });
    }));
});
