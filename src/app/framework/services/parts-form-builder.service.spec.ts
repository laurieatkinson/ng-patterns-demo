import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { async } from '@angular/core/testing';
import { TestInjector } from '../../demo-common/testing/testing-helpers';
import { PostingService } from '../../demo-common/services/posting.service';
import { DataService } from './data.service';
import { IPartsFormControl } from '../models/form-controls.models';
import { PartsFormBuilderService } from './parts-form-builder.service';
import { PostingEntityDataService } from '../../demo-common/services/posting-entity-data.service';
import { SystemMessageDataService } from './system-message-data.service';
import { SystemMessageService } from './system-message.service';

class MockEntityDataService extends PostingEntityDataService {
    protected get planUrlPrefix() {
        return `accounts/CF0102`;
    }
    endpoint() {
        return 'accounts/CF0102/loans';
    }
}
const tooltips = [{
    messageId: 1,
    fieldName: 'name',
    tooltipText: 'Enter Name'
},
{
    messageId: 2,
    fieldName: 'terms_genMinTerm',
    tooltipText: 'Enter Gen Min Term'
},
{
    messageId: 3,
    fieldName: 'sampleList_code',
    tooltipText: 'Enter Code'
}];

class MockSystemMessageDataService {
    getTooltips(module: string, component: string) {
        return new Promise<Array<{ messageId: number;
                                   fieldName: string;
                                   tooltipText: string;
                                  }>>((resolve) => {
            resolve(tooltips);
        });
    }
    getTooltip(fieldName: string, component: string) {
        const match = tooltips.find(item => {
            return item.fieldName === fieldName;
        });
        if (match) {
            return match.tooltipText;
        }
        return null;
    }
}

describe('PartsFormBuilderService', () => {
    const formControls: Array<IPartsFormControl> = [
        { name: 'name' },
        { name: 'interestRate' },
        { name: 'primeRate' },
        { name: 'plusRate' },
        { name: 'minLoanAmt' },
        { name: 'minRepaymentAmt' },
        { name: 'calculateOn' },
        { name: 'limitationValue' },
        { name: 'limitationPerType' },
        { name: 'limitationBasedOn' },
        { name: 'initiationOptions' },
        { name: 'maxNumOfLoan' },
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

    let service: PartsFormBuilderService;
    let formBuilder: FormBuilder;
    let dataService: PostingEntityDataService;

    beforeAll(() => {
        TestInjector.setInjector([
            { provide: PostingEntityDataService, useClass: MockEntityDataService },
            { provide: SystemMessageDataService, useClass: MockSystemMessageDataService},
            { provide: SystemMessageService, useClass: SystemMessageService }
        ]);
        service = TestInjector.getService(PartsFormBuilderService);
        formBuilder = TestInjector.getService(FormBuilder);
        dataService = TestInjector.getService(PostingEntityDataService);
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
        expect((<FormGroup>formGroup.controls['terms']).controls['genMinTerm'].enabled).toBeTruthy();
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

    it('should add tooltip to form', async(() => {
        const formGroup = formBuilder.group({});
        service.buildModelDrivenForm(formGroup, formControls, null, dataService, '')
            .then(() => {
                expect((<any>formGroup.controls['name']).tooltip).toBe('Enter Name');
            });
    }));

    it('should add tooltip for nested field', async(() => {
        const formGroup = formBuilder.group({});
        service.buildModelDrivenForm(formGroup, formControls, null, dataService, '')
            .then(() => {
                expect((<any>(<FormGroup>formGroup.controls['terms']).controls['genMinTerm']).tooltip).toBe('Enter Gen Min Term');
            });
    }));

    it('should add tooltip for field in array', async(() => {
        const formGroup = formBuilder.group({});
        service.buildModelDrivenForm(formGroup, formControls, null, dataService, '')
            .then(() => {
                expect((<any>(<FormGroup>(<FormArray>formGroup.controls['sampleList']).controls[0])
                        .controls['code']).tooltip).toBe('Enter Code');
            });
    }));

    it('should not add tooltip if not found', async(() => {
        const formGroup = formBuilder.group({});
        service.buildModelDrivenForm(formGroup, formControls, null, dataService, '')
            .then(() => {
                expect((<any>(<FormGroup>formGroup.controls['terms']).controls['genMaxTerm']).tooltip).toBeNull();
            });
    }));
});
