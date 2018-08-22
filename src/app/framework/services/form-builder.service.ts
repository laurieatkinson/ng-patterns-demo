import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ValidationService } from '../validation/services/validation.service';
import { TransactionEntityDataService } from '../../demo-common/services/transaction-entity-data.service';
import { AuthorizationService } from './authorization.service';
import { IPartsFormControl } from '../models/form-controls.models';
import { ICurrentControlValidators } from '../validation/models/validation.models';

@Injectable()
export class FormBuilderService {

    constructor(private authorizationService: AuthorizationService,
        private formBuilder: FormBuilder) { }

    // Add controls to the FormGroup passed in
    buildModelDrivenForm(formGroup: FormGroup, formControls: IPartsFormControl | Array<IPartsFormControl>,
        validationService: ValidationService,
        dataService: TransactionEntityDataService,
        formGroupToValidate: string,
        parameter?: string) {

        const promise = new Promise<Array<ICurrentControlValidators>>((resolve, reject) => {
            if (Array.isArray(formControls)) {
                formControls.forEach(control => {
                    this.parseNextControl(formGroup, control);
                });
            } else {
                this.parseNextControl(formGroup, formControls);
            }

            // Add field-level validation rules to the form controls
            // Must supply the dataService instance to derive the endpoint with the validation rules
            if (validationService) {
                if (formGroupToValidate && formGroup.controls[formGroupToValidate] instanceof FormGroup) {
                    formGroup = <FormGroup>formGroup.controls[formGroupToValidate];
                }
                validationService.applyValidationRules(formGroup, dataService, parameter)
                    .then((controlValidators) => {
                        resolve(controlValidators);
                    }).catch(() => {
                        resolve([]);
                    });
            } else {
                resolve([]);
            }
        });
        return promise;
    }

    private parseNextControl(formGroup: FormGroup, control: IPartsFormControl) {
        if (control.controls) {
            const parentFormGroup = this.formBuilder.group({});
            const brackets = control.name.indexOf('[]');
            if (brackets !== -1) {
                const parentFormArray = this.formBuilder.array([parentFormGroup]);
                this.addControl(formGroup, control.name.substring(0, brackets),
                    parentFormArray);
            } else {
                this.addControl(formGroup, control.name, parentFormGroup);
            }
            control.controls.forEach(childControl => {
                if (Array.isArray(childControl)) {
                    childControl.forEach(ctrl => {
                        this.parseNextControl(parentFormGroup, ctrl);
                    });
                } else {
                    this.parseNextControl(parentFormGroup, childControl);
                }
            });
        } else {
            const newControl = new FormControl({
                value: control.defaultValue,
                disabled: !this.authorizationService.hasPermission(control.disableIfNotAuthorized)
            });
            newControl.markAsPristine();
            this.addControl(formGroup, control.name, newControl);
        }
    }

    private addControl(formGroup: FormGroup, controlName: string,
        control: FormControl | FormArray | FormGroup) {

        formGroup.addControl(controlName, control);
    }
}
