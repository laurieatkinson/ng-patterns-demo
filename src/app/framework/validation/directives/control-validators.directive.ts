import { AbstractControl } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { SystemMessageService } from '../../services/system-message.service';
import { AppInjector } from '../../../app-injector.service';

export class ControlValidators {

    private static _instance: ControlValidators;
    private systemMessageService: SystemMessageService;

    private static get instance() {
        if (!ControlValidators._instance) {
            ControlValidators._instance = new ControlValidators();
            const injector = AppInjector.getInstance().getInjector();
            ControlValidators._instance.systemMessageService = injector.get(SystemMessageService);
        }
        return ControlValidators._instance;
    }

    static numberValidator = (errorMessageOrId: string | number, errorParameters?: Array<string>) => {
        return (control: AbstractControl) => {
            if (isNaN(control.value)) {
                return {
                    numberValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
                };
            }
            return null;
        };
    }

    static requiredValidator = (errorMessageOrId: string | number, errorParameters?: Array<string>) => {
        return (control: AbstractControl) => {
            const val: string = control.value;
            if (val == null || val.length === 0) {
                return {
                    requiredValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
                };
            }
            return null;
        };
    }

    static minValueValidator = (min: number, inclusive: boolean,
        errorMessageOrId: string | number, errorParameters?: Array<string>, allowZero?: boolean) => {
        return (control: AbstractControl) => {
            if (control.value === null) {
                return null;
            }
            if (allowZero && control.value === 0) {
                return null;
            }
            if (isNaN(control.value) || Number(control.value) < min ||
                (!inclusive && Number(control.value) === min)) {
                return {
                    minValueValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
                };
            }
            return null;
        };
    }

    static maxValueValidator = (max: number, inclusive: boolean, errorMessageOrId: string | number, errorParameters?: Array<string>) => {
        return (control: AbstractControl) => {
            if (control.value === null) {
                return null;
            }
            if (isNaN(control.value) || Number(control.value) > max ||
                (!inclusive && Number(control.value) === max)) {
                return {
                    maxValueValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
                };
            }
            return null;
        };
    }

    // This control must be numerically less than the other control
    static lessThanAnotherValidator = (controlKey: string, inclusive: boolean,
        errorMessageOrId: string | number, errorParameters?: Array<string>) => {
        return (control: AbstractControl) => {
            if (control.value === null) {
                return null;
            }
            const otherControl = ControlValidators.getOtherControl(control, controlKey);
            if (!otherControl || otherControl.value === null || isNaN(control.value)) {
                return null;
            }
            if (isNaN(control.value) || Number(control.value) > Number(otherControl.value) ||
                (inclusive && Number(control.value) === Number(otherControl.value))) {
                return {
                    lessThanAnotherValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
                };
            }
            return null;
        };
    }

    // This control must be numerically greater than the other control
    static greaterThanAnotherValidator = (controlKey: string, inclusive: boolean,
        errorMessageOrId: string | number, errorParameters?: Array<string>) => {
        return (control: AbstractControl) => {
            if (control.value === null) {
                return null;
            }
            const otherControl = ControlValidators.getOtherControl(control, controlKey);
            if (!otherControl || otherControl.value === null || isNaN(control.value)) {
                return null;
            }
            if (isNaN(control.value) || Number(control.value) < Number(otherControl.value) ||
                (inclusive && Number(control.value) === Number(otherControl.value))) {
                return {
                    lessThanAnotherValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
                };
            }
            return null;
        };
    }

    // If this control is true (has a value), then the other control is required
    static requiredIfTrueValidator = (controlKey: string, errorMessageOrId: string | number,
        zeroIsEmpty = false, errorParameters?: Array<string>) => {
        return (control: AbstractControl) => {
            const otherControl = ControlValidators.getOtherControl(control, controlKey);
            if (!otherControl || !otherControl.value) {
                return null;
            }
            const val: string = control.value;
            if (val == null || val.length === 0 || (zeroIsEmpty && +val === 0)) {
                return {
                    requiredIfTrueValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
                };
            }
            return null;
        };
    }

    // If this control is false (empty), then the other control is required
    static requiredIfFalseValidator = (controlKey: string, errorMessageOrId: string | number,
        zeroIsEmpty = false, errorParameters?: Array<string>) => {
        return (control: AbstractControl) => {
            const otherControl = ControlValidators.getOtherControl(control, controlKey);
            if (!otherControl || !otherControl.value) {
                return null;
            }
            const val: string = control.value;
            if (!(val == null || val.length === 0 || (zeroIsEmpty && +val === 0))) {
                return {
                    requiredIfFalseValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
                };
            }
            return null;
        };
    }

    // If this control has a value, then the other control cannot be false/0/empty
    static notAllowedIfFalseValidator = (controlKey: string, errorMessageOrId: string | number,
        zeroIsFalse = true, errorParameters?: Array<string>) => {
        return (control: AbstractControl) => {
            const otherControl = ControlValidators.getOtherControl(control, controlKey);
            if (!otherControl) {
                return null;
            }
            const val: string = control.value;
            // If this control has a value
            if (val !== null && (val.length > 0 || +val !== 0 || !zeroIsFalse)) {
                const otherValue: string = otherControl.value;
                // and the other control is empty, this is an error
                if (otherValue === null || (otherValue.length === 0 ||
                    (zeroIsFalse && +otherValue === 0))) {
                    return {
                        notAllowedIfFalseValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
                    };
                }
            }
            return null;
        };
    }

    // Valid if either (or both) of the controls has a value
    static eitherRequiredValidator = (controlKey: string, errorMessageOrId: string | number,
        zeroIsEmpty = false, errorParameters?: Array<string>) => {
        return (control: AbstractControl) => {
            const val: any = control.value;
            if (val == null || val === false || val.length === 0 || (zeroIsEmpty && +val === 0)) {
                const otherControl = ControlValidators.getOtherControl(control, controlKey);
                if (otherControl) {
                    const val2 = otherControl.value;
                    if (val2 == null || val2 === false || val2.length === 0 || (zeroIsEmpty && +val2 === 0)) {
                        return {
                            eitherRequiredValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
                        };
                    }
                }
            }
            return null;
        };
    }

    // If one control has a value, then the other cannot also have a value
    static bothNotAllowedValidator = (controlKey: string, errorMessageOrId: string | number,
        zeroIsEmpty = false, errorParameters?: Array<string>) => {
        return (control: AbstractControl) => {
            let thisControlEmpty = false;
            let otherControlEmpty = false;

            const val: any = control.value;
            if (val == null || val === false || val.length === 0 || (zeroIsEmpty && +val === 0)) {
                thisControlEmpty = true;
            }

            const otherControl = ControlValidators.getOtherControl(control, controlKey);
            if (otherControl) {
                const val2 = otherControl.value;
                if (val2 == null || val2 === false || val2.length === 0 || (zeroIsEmpty && +val2 === 0)) {
                    otherControlEmpty = true;
                }
            }

            // If just cleared this control, need to remove error from the other control
            if (thisControlEmpty && otherControl && !otherControlEmpty &&
                otherControl.errors && otherControl.errors['bothNotAllowedValidator']) {
                delete otherControl.errors['bothNotAllowedValidator'];
                otherControl.updateValueAndValidity();
            }

            // No error if either control is empty
            if (thisControlEmpty || otherControlEmpty) {
                // For some reason, the error is sometimes not being removed
                if (control.errors && control.errors['bothNotAllowedValidator']) {
                    delete control.errors['bothNotAllowedValidator'];
                }
                return null;
            }
            return {
                bothNotAllowedValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
            };
        };
    }

    // If one field has a value, then the other is also required
    static bothRequiredTogetherValidator = (controlKey: string, errorMessageOrId: string | number,
        zeroIsEmpty = false, errorParameters?: Array<string>) => {
        return (control: AbstractControl) => {
            let thisControlEmpty = false;
            let otherControlEmpty = false;

            const val: any = control.value;
            if (val == null || val === false || val.length === 0 || (zeroIsEmpty && +val === 0)) {
                thisControlEmpty = true;
            }

            const otherControl = ControlValidators.getOtherControl(control, controlKey);
            if (otherControl) {
                const val2 = otherControl.value;
                if (val2 == null || val2 === false || val2.length === 0 || (zeroIsEmpty && +val2 === 0)) {
                    otherControlEmpty = true;
                }
            }

            // No error both have values or both are empty
            if ((!thisControlEmpty && !otherControlEmpty) || (thisControlEmpty && otherControlEmpty)) {
                // Need to remove error from the other control if:
                //   just cleared this control and the other was empty OR
                //   just entered a value in this control and the other had a value
                if (otherControl && otherControl.errors && otherControl.errors['bothRequiredTogetherValidator']) {
                    if ((!thisControlEmpty && !otherControlEmpty) || (thisControlEmpty && otherControlEmpty)) {
                        delete otherControl.errors['bothRequiredTogetherValidator'];
                        otherControl.updateValueAndValidity();
                    }
                }
                return null;
            }
            return {
                bothRequiredTogetherValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
            };
        };
    }

    static minDateValidator = (minDate: Date, inclusive: boolean, errorMessageOrId: string | number, errorParameters?: Array<string>) => {
        return (control: AbstractControl) => {
            if (!UtilitiesService.isDate(control.value)) {
                return null;
            }
            if (UtilitiesService.isBeforeDate(control.value, minDate) ||
                (!inclusive && UtilitiesService.isSameDate(control.value, minDate))) {
                return {
                    minDateValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
                };
            }
            return null;
        };
    }

    // This date control must be before the other control
    static beforeAnotherDateValidator = (controlKey: string, inclusive: boolean, errorMessageOrId: string | number,
        errorParameters?: Array<string>) => {
        return (control: AbstractControl) => {
            let invalidDate = false;
            if (!UtilitiesService.isDate(control.value)) {
                invalidDate = true;
            }
            const otherControl = ControlValidators.getOtherControl(control, controlKey);
            if (!UtilitiesService.isDate(otherControl.value)) {
                invalidDate = true;
            }
            if (!invalidDate &&
                (UtilitiesService.isAfterDate(control.value, otherControl.value)
                     || (!inclusive && UtilitiesService.isSameDate(control.value, otherControl.value))
                )
            ) {
                return {
                    beforeAnotherDateValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
                };
            }
            if (otherControl && otherControl.errors && otherControl.errors['afterAnotherDateValidator']) {
                delete otherControl.errors['afterAnotherDateValidator'];
                otherControl.updateValueAndValidity();
            }
            return null;
        };
    }

    // This date control must be after the other control
    static afterAnotherDateValidator = (controlKey: string, inclusive: boolean, errorMessageOrId: string | number,
        errorParameters?: Array<string>) => {
        return (control: AbstractControl) => {
            let invalidDate = false;
            if (!UtilitiesService.isDate(control.value)) {
                invalidDate = true;
            }
            const otherControl = ControlValidators.getOtherControl(control, controlKey);
            if (!UtilitiesService.isDate(otherControl.value)) {
                invalidDate = true;
            }
            if (!invalidDate &&
                (UtilitiesService.isBeforeDate(control.value, otherControl.value)
                     || (!inclusive && UtilitiesService.isSameDate(control.value, otherControl.value))
                )) {
                return {
                    afterAnotherDateValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
                };
            }
            if (otherControl && otherControl.errors && otherControl.errors['beforeAnotherDateValidator']) {
                delete otherControl.errors['beforeAnotherDateValidator'];
                otherControl.updateValueAndValidity();
            }
            return null;
        };
    }

    static maxDateValidator = (maxDate: Date, inclusive: boolean, errorMessageOrId: string | number,
        errorParameters?: Array<string>) => {
        return (control: AbstractControl) => {
            if (!UtilitiesService.isDate(control.value)) {
                return null;
            }
            if (UtilitiesService.isAfterDate(control.value, maxDate) ||
                (!inclusive && UtilitiesService.isSameDate(control.value, maxDate))) {
                return {
                    maxDateValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
                };
            }
            return null;
        };
    }

    static numericRangeValidator = (range: {
        minValue: number,
        maxValue: number,
        allowZero?: boolean,
        inclusive?: boolean,
        errorMessage?: string,
        errorMessageId?: number,
        errorParameters?: Array<string>
    }) => {
        return (control: AbstractControl) => {
            if (control.value === null) {
                return null;
            }
            if (range.allowZero && control.value === 0) {
                return null;
            }
            // Default to inclusive
            if (!range.hasOwnProperty('inclusive')) {
                range.inclusive = true;
            }
            const num = +control.value;
            if (isNaN(control.value) || !(num <= range.maxValue && num >= range.minValue) ||
                (!range.inclusive && (num === range.maxValue || num === range.minValue))) {
                return {
                    rangeValueValidator: ControlValidators.getErrorMessage(
                        range.errorMessageId ||
                        range.errorMessage, range.errorParameters)
                };
            }
            return null;
        };
    }

    static maxLengthValidator = (maxLength: number, errorMessageOrId: string | number, errorParameters?: Array<string>) => {
        return (control: AbstractControl) => {
            if (control.value && control.value.length > maxLength) {
                return {
                    maxLengthValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
                };
            }
            return null;
        };
    }

    static patternValidator = (pattern: string, errorMessageOrId: string | number, errorParameters?: Array<string>) => {
        return (control: AbstractControl) => {
            if (control.value) {
                const regex = new RegExp(`^${pattern}$`);
                const value = <string>control.value;
                if (!regex.test(value)) {
                    return {
                        patternValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
                    };
                }
            }
            return null;
        };
    }

    static anyValueExceptValidator = (except: Array<string>, errorMessageOrId: string | number, errorParameters?: Array<string>) => {
        return (control: AbstractControl) => {
            const val: string = control.value;
            if (val == null || val.length === 0 || except.indexOf(val) !== -1) {
                return {
                    anyValueExceptValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
                };
            }
            return null;
        };
    }

    // Must equal one of these values
    static mustEqualValidator = (options: Array<string>, errorMessageOrId: string | number, errorParameters?: Array<string>) => {
        return (control: AbstractControl) => {
            const val: string = control.value;
            if (options.indexOf(val) === -1) {
                return {
                    mustEqualValidator: ControlValidators.getErrorMessage(errorMessageOrId, errorParameters)
                };
            }
            return null;
        };
    }

    private static getOtherControl(control: AbstractControl, controlKey: string) {
        const parts = controlKey.split('.');
        let parent = control;
        parts.forEach(part => {
            parent = parent.parent;
        });
        return parent.get(controlKey);
    }

    private static getErrorMessage(errorMessageOrId: string | number, errorParameters?: Array<string>) {
        if (typeof errorMessageOrId === 'number') {
            return ControlValidators.instance.systemMessageService.getMessage(
                errorMessageOrId, errorParameters);
        }
        return errorMessageOrId;
    }
}
