import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { TestInjector } from '../../demo-common/testing/testing-helpers';
import { IPartsFormControl } from '../models/form-controls.models';
import { FormBuilderService } from './form-builder.service';
import { TransactionEntityDataService } from '../../demo-common/services/transaction-entity-data.service';

class MockEntityDataService extends TransactionEntityDataService {
    protected get urlPrefix() {
        return `accounts/AA0102`;
    }
    endpoint() {
        return 'accounts/AA0102/loans';
    }
}

describe('FormBuilderService', () => {
    const formControls: Array<IPartsFormControl> = [
        { name: 'name' },
        { name: 'interestRate' },
        { name: 'primeRate' },
        { name: 'plusRate' },
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

    let service: FormBuilderService;
    let formBuilder: FormBuilder;
    let dataService: TransactionEntityDataService;

    beforeAll(() => {
        TestInjector.setInjector([
            { provide: TransactionEntityDataService, useClass: MockEntityDataService }
        ]);
        service = TestInjector.getService(FormBuilderService);
        formBuilder = TestInjector.getService(FormBuilder);
        dataService = TestInjector.getService(TransactionEntityDataService);
    });

    it('should create the service', () => {
        expect(service).toBeTruthy();
    });

    it('should build model driven form', () => {
        const formGroup = formBuilder.group({});
        service.buildModelDrivenForm(formGroup, formControls, null, null, '');
        expect(formGroup.controls['name'].enabled).toBeTruthy();
    });

    it('should build nested control', () => {
        const formGroup = formBuilder.group({});
        service.buildModelDrivenForm(formGroup, formControls, null, null, '');
        expect((<FormGroup>formGroup.controls['terms']).controls['minTerm'].enabled).toBeTruthy();
    });

    it('should build controls inside an array', () => {
        const formGroup = formBuilder.group({});
        service.buildModelDrivenForm(formGroup, formControls, null, null, '');
        expect((<FormGroup>(<FormArray>formGroup.controls['sampleList']).controls[0]).controls['code'].enabled).toBeTruthy();
    });

    it('should build controls inside an array that is inside a group', () => {
        const formGroup = formBuilder.group({});
        service.buildModelDrivenForm(formGroup, formControls, null, null, '');
        expect((<FormGroup>(<FormArray>(<FormGroup>formGroup.controls['accountFees']).controls['fees'])
                .controls[0]).controls['tierFrom'].enabled).toBeTruthy();
    });

    it('should build more controls inside an array that is inside a group', () => {
        const formGroup = formBuilder.group({});
        service.buildModelDrivenForm(formGroup, formControls, null, null, '');
        expect((<FormGroup>(<FormArray>(<FormGroup>formGroup.controls['accountFees']).controls['testFees'])
                .controls[0]).controls['tierTo'].enabled).toBeTruthy();
    });
});
