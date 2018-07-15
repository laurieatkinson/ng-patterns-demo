import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, ValidatorFn } from '@angular/forms';
import { PartsValidationService } from '../validation/services/parts-validation.service';
import { PostingEntityDataService } from '../../demo-common/services/posting-entity-data.service';
import { AuthorizationService } from './authorization.service';
import { IPartsFormControl } from '../models/form-controls.models';
import { SystemMessageService } from './system-message.service';
import { ICurrentControlValidators } from '../validation/models/validation.models';

@Injectable()
export class PartsFormBuilderService {

    constructor(private authorizationService: AuthorizationService,
        private formBuilder: FormBuilder,
        private systemMessageService: SystemMessageService) { }

    // Add controls to the FormGroup passed in
    buildModelDrivenForm(formGroup: FormGroup, formControls: IPartsFormControl | Array<IPartsFormControl>,
        partsValidationService: PartsValidationService,
        dataService: PostingEntityDataService,
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
            if (partsValidationService) {
                if (formGroupToValidate && formGroup.controls[formGroupToValidate] instanceof FormGroup) {
                    formGroup = <FormGroup>formGroup.controls[formGroupToValidate];
                }
                partsValidationService.applyValidationRules(formGroup, dataService, parameter)
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

    private addTooltipToEachControl(formGroup: FormGroup, componentName: string) {
        Object.keys(formGroup.controls).forEach(fieldName => {
            if (formGroup.controls[fieldName] instanceof FormGroup) {
                this.addTooltipToEachControl((<FormGroup>formGroup.controls[fieldName]), componentName);
            } else if (formGroup.controls[fieldName] instanceof FormArray) {
                (<FormArray>formGroup.controls[fieldName]).controls.forEach(arrayItem => {
                    if (arrayItem instanceof FormGroup) {
                        this.addTooltipToEachControl(arrayItem, componentName);
                    }
                });
            } else {
                if (formGroup.parent && formGroup.parent.controls) {
                    for (const prop in formGroup.parent.controls) {
                        if (formGroup.parent.controls[prop].controls &&
                            formGroup.parent.controls[prop].controls.hasOwnProperty(fieldName)) {
                            let controlName = `${prop}_${fieldName}`;

                            // If this control is inside an array, then go up one level and use
                            // the name of the array concatenated with the field name
                            if (Array.isArray(formGroup.parent.controls) && formGroup.parent.parent.controls) {
                                for (const parentProp in formGroup.parent.parent.controls) {
                                    // Get the array grandparent and then from there get one element in the array
                                    // See if that contains the property we are currently looking at
                                    if (formGroup.parent.parent.controls[parentProp].controls &&
                                        formGroup.parent.parent.controls[parentProp].controls[0] &&
                                        formGroup.parent.parent.controls[parentProp].controls[0].controls &&
                                        formGroup.parent.parent.controls[parentProp].controls[0].controls.hasOwnProperty(fieldName)) {
                                        controlName = `${parentProp}_${fieldName}`;
                                        break;
                                    }
                                }
                            }
                            this.addTooltipToControl(controlName, <FormControl>formGroup.controls[fieldName], componentName);
                            break;
                        }
                    }
                } else {
                    this.addTooltipToControl(fieldName, <FormControl>formGroup.controls[fieldName], componentName);
                }
            }
        });
    }

    private addTooltipToControl(controlName: string,
        control: FormControl,
        componentName: string) {
        // Attach a custom property to the control named tooltip
        (<any>control).tooltip = this.systemMessageService.getTooltip(
            controlName, componentName, 'planRule');
    }
}
