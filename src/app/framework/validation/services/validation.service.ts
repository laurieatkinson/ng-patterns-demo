import { Injectable } from '@angular/core';
import { FormGroup, ValidatorFn } from '@angular/forms';
import { DataService } from '../../services/data.service';
import {
    INumberValidator,
    INumericMaxValueValidator,
    INumericMinValueValidator,
    INumericRangeValidator,
    IRequiredValidator,
    IMaxLengthValidator,
    IPatternValidator,
    IValidationRules,
    IValidator,
    IDateMinValueValidator,
    IDateMaxValueValidator,
    ICurrentControlValidators,
    IFormValidationRules
} from '../models/validation.models';
import { ControlValidators } from '../directives/control-validators.directive';

@Injectable()
export class ValidationService {

    applyValidationRules(formGroup: FormGroup, dataService: DataService, additionalRouteParam: string) {
        const endpoint = this.validationEndpoint(dataService, additionalRouteParam);
        return new Promise<Array<ICurrentControlValidators>>((resolve) => {
            dataService.put<IValidationRules>(endpoint, null)
            .then(rules => {
                let dto = (<IFormValidationRules>rules).dto;
                if (!dto) {
                    dto = (<IFormValidationRules>rules).dtoList;
                }
                resolve(this.addRulesToControls(formGroup, dto));
            })
            .catch(() => {
                resolve(null);
                // No validation rules
            });
        });
    }

    applyClientOnlyValidationRule(formGroup: FormGroup, fieldName: string,
                                  validators: Array<ValidatorFn>,
                                  currentValidators: Array<ICurrentControlValidators>,
                                  warnings?: string[]) {
        return this.applyValidatorToControl(formGroup, fieldName, validators, currentValidators, warnings);
    }

    // Append getValidators=true to the request to change the response
    // to a list of validation rules for each property
    protected validationEndpoint(dataService: DataService, additionalRouteParam?: string) {
        let endpoint = dataService.endpoint(additionalRouteParam);
        endpoint += endpoint.indexOf('?') === -1 ? '?' : '&';
        endpoint += 'getValidators=true';
        return endpoint;
    }

    protected addRulesToControls(formGroup: FormGroup, validationRules: IValidationRules) {
        const controlValidators = [];
        if (validationRules && validationRules.properties) {
            for (const prop of validationRules.properties) {
                const validatorArray = this.buildFieldValidators(prop.rules);

                if (validatorArray.length > 0) {
                    const validators = this.applyValidatorToControl(formGroup, prop.name, validatorArray, null);
                    if (validators) {
                        controlValidators.push(validators);
                    }
                    this.setWarningOnValidators(prop.rules, validatorArray);
                }

                // If validator includes readOnly attribute, disable the control
                this.disableReadOnlyControl(formGroup, prop.name, prop.rules);
            }
        }
        return controlValidators;
    }

    // This method is used only to apply client hint validators - not client only validators
    private buildFieldValidators(rules: Array<IValidator>): any[] {
        const validatorArray: Array<Function> = [];

        for (const rule of rules) {
            switch (rule.type) {
                case 'numberValidator':
                    validatorArray.push(ControlValidators.numberValidator((<INumberValidator>rule).numberValidator.errorMessage));
                    break;
                case 'requiredValidator':
                    validatorArray.push(ControlValidators.requiredValidator((<IRequiredValidator>rule).requiredValidator.errorMessage));
                    break;
                case 'numericMinValueValidator':
                    validatorArray.push(ControlValidators.minValueValidator(
                                            (<INumericMinValueValidator>rule).numericMinValueValidator.minValue,
                                            (<INumericMinValueValidator>rule).numericMinValueValidator.inclusive,
                                            (<INumericMinValueValidator>rule).numericMinValueValidator.errorMessage));
                    break;
                case 'numericMaxValueValidator':
                    validatorArray.push(ControlValidators.maxValueValidator(
                                        (<INumericMaxValueValidator>rule).numericMaxValueValidator.maxValue,
                                        (<INumericMaxValueValidator>rule).numericMaxValueValidator.inclusive,
                                        (<INumericMaxValueValidator>rule).numericMaxValueValidator.errorMessage));
                    break;
                case 'numericRangeValidator':
                    validatorArray.push(ControlValidators.numericRangeValidator(
                                        (<INumericRangeValidator>rule).numericRangeValidator));
                    break;
                case 'maxLengthValidator':
                    validatorArray.push(ControlValidators.maxLengthValidator(
                                        (<IMaxLengthValidator>rule).maxLengthValidator.maxLength,
                                        (<IMaxLengthValidator>rule).maxLengthValidator.errorMessage));
                    break;
                case 'dateMinValueValidator':
                    validatorArray.push(ControlValidators.minDateValidator(
                                            (<IDateMinValueValidator>rule).dateMinValueValidator.minValue,
                                            (<IDateMinValueValidator>rule).dateMinValueValidator.inclusive,
                                            (<IDateMinValueValidator>rule).dateMinValueValidator.errorMessage));
                    break;
                case 'dateMaxValueValidator':
                    validatorArray.push(ControlValidators.maxDateValidator(
                                        (<IDateMaxValueValidator>rule).dateMaxValueValidator.maxValue,
                                        (<IDateMaxValueValidator>rule).dateMaxValueValidator.inclusive,
                                        (<IDateMaxValueValidator>rule).dateMaxValueValidator.errorMessage));
                    break;
                case 'patternValidator':
                    validatorArray.push(ControlValidators.patternValidator(
                                        (<IPatternValidator>rule).patternValidator.pattern,
                                        (<IPatternValidator>rule).patternValidator.errorMessage));
                    break;
            }
        }

        return validatorArray;
    }

    private setWarningOnValidators(rules: Array<IValidator>, validatorArray: Array<Function>) {
        const warnings: string[] = [];
        for (const rule of rules) {
            if (rule.isWarning) {
                warnings.push(rule.type);
            }
        }
    }

    private applyValidatorToControl(formGroup: FormGroup, controlName: string,
                                    validatorArray: any[],
                                    currentValidators: Array<ICurrentControlValidators>,
                                    warnings?: string[]): ICurrentControlValidators {
        const controlNameParts = controlName.split('_');
        controlName = controlNameParts[controlNameParts.length - 1];

        // Loop through the form groups from the top down
        for (let i = 0; i < controlNameParts.length - 1; i++) {
            if (formGroup && formGroup.controls) {
                const formGroupName = controlNameParts[i];

                // It is possible that the formGroup for this component is a level down
                // from the controlName coming from the server.
                // This happens if the component has flattened the structure for simplicity.
                if (formGroup.controls[formGroupName] instanceof FormGroup) {
                    formGroup = <FormGroup>formGroup.controls[formGroupName];
                }
            }
        }

        const control = formGroup && formGroup.controls ? formGroup.controls[controlName] : null;
        if (control) {
            let validators = validatorArray;
            if (currentValidators) {
                const currentValidator = currentValidators.find(item => {
                    return item.control === control;
                });
                if (currentValidator) {
                    validators = currentValidator.validators.concat(validatorArray);
                }
            }
            control.setValidators(validators);
            control.updateValueAndValidity();

            if (warnings) {
                (<any>control).warnings = warnings;
            }

            return {
                control: control,
                validators: validators
            };
        }
        return null;
    }

    private disableReadOnlyControl(formGroup: FormGroup, controlName: string, rules: Array<IValidator>) {
        if (rules.some(rule => { return rule.type === 'readOnly'; })) {
            formGroup.controls[controlName].disable();
        }
    }
}
