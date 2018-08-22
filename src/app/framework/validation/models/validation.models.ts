import { AbstractControl, ValidatorFn } from '@angular/forms';

export type validationType =
    'readOnly' |
    'requiredValidator' |
    'numberValidator' |
    'numericMinValueValidator' |
    'numericMaxValueValidator' |
    'maxLengthValidator' |
    'numericRangeValidator' |
    'dateMinValueValidator' |
    'dateMaxValueValidator' |
    'afterAnotherDateValidator' |
    'beforeAnotherDateValidator' |
    'patternValidator' |
    'anyValueExceptValidator' |
    'lessThanAnotherValidator' |
    'greaterThanAnotherValidator' |
    'requiredIfTrueValidator' |
    'requiredIfFalseValidator' |
    'mustEqualValidator' |
    'notAllowedIfFalseValidator' |
    'eitherRequiredValidator' |
    'bothNotAllowedValidator' |
    'bothRequiredTogetherValidator';


    export interface IValidationRules {
    type: validationType;
    properties: Array<{
        fieldName: string,
        rules: Array<IValidator>}>;
}

export interface IValidator {
    type: validationType;
    isWarning?: boolean; // Not implemented on the server yet
}

interface IValidationRule {
    errorMessage: string;
}

interface IValidateWithAnotherControlRule extends IValidationRule {
    controlKey: string;
}

interface ICompareWithAnotherControlRule extends IValidateWithAnotherControlRule {
    inclusive: boolean;
}

export interface IRequiredValidator extends IValidator {
    type: 'requiredValidator';
    requiredValidator: IValidationRule;
}

export interface INumberValidator extends IValidator {
    type: 'numberValidator';
    numberValidator: IValidationRule;
}

export interface IMaxLengthValidator extends IValidator {
    type: 'maxLengthValidator';
    maxLengthValidator: {
        maxLength: number,
        errorMessage: string
    };
}

export interface INumericMinValueValidator extends IValidator {
    type: 'numericMinValueValidator';
    numericMinValueValidator: {
        minValue: number,
        inclusive: boolean,
        errorMessage: string
    };
}

export interface INumericMaxValueValidator extends IValidator {
    type: 'numericMaxValueValidator';
    numericMaxValueValidator: {
        maxValue: number,
        inclusive: boolean,
        errorMessage: string
    };
}

export interface IDateMinValueValidator extends IValidator {
    type: 'dateMinValueValidator';
    dateMinValueValidator: {
        minValue: Date,
        inclusive: boolean,
        errorMessage: string
    };
}

export interface IDateMaxValueValidator extends IValidator {
    type: 'dateMaxValueValidator';
    dateMaxValueValidator: {
        maxValue: Date,
        inclusive: boolean,
        errorMessage: string
    };
}

export interface INumericRangeValidator extends IValidator {
    type: 'numericRangeValidator';
    numericRangeValidator: {
        minValue: number,
        maxValue: number,
        inclusive: boolean,
        errorMessage: string
    };
}

export interface IPatternValidator extends IValidator {
    type: 'patternValidator';
    patternValidator: {
        pattern: string,
        errorMessage: string
    };
}

// Client-only validators for interdependent fields
export interface IRequiredIfTrueValidator extends IValidator {
    type: 'requiredIfTrueValidator';
    requiredIfTrueValidator: IValidateWithAnotherControlRule;
}

export interface IRequiredIfFalseValidator extends IValidator {
    type: 'requiredIfFalseValidator';
    requiredIfFalseValidator: IValidateWithAnotherControlRule;
}

export interface IMustEqualValidator extends IValidator {
    type: 'mustEqualValidator';
    mustEqualValidator: {
        options: Array<string>,
        errorMessage: string
    };
}

export interface INotAllowedIfFalseValidator extends IValidator {
    type: 'notAllowedIfFalseValidator';
    notAllowedIfFalseValidator: IValidateWithAnotherControlRule;
}

export interface IEitherRequiredValidator extends IValidator {
    type: 'eitherRequiredValidator';
    eitherRequiredValidator: IValidateWithAnotherControlRule;
}

export interface IBothNotAllowedValidator extends IValidator {
    type: 'bothNotAllowedValidator';
    bothNotAllowedValidator: IValidateWithAnotherControlRule;
}

export interface IBothRequiredTogetherValidator extends IValidator {
    type: 'bothRequiredTogetherValidator';
    bothRequiredTogetherValidator: IValidateWithAnotherControlRule;
}

export interface ILessThanAnotherValidator extends IValidator {
    type: 'lessThanAnotherValidator';
    lessThanAnotherValidator: ICompareWithAnotherControlRule;
}

export interface IGreaterThanAnotherValidator extends IValidator {
    type: 'greaterThanAnotherValidator';
    greaterThanAnotherValidator: ICompareWithAnotherControlRule;
}

export interface IBeforeAnotherDateValidator extends IValidator {
    type: 'beforeAnotherDateValidator';
    beforeAnotherDateValidator: ICompareWithAnotherControlRule;
}

export interface IAfterAnotherDateValidator extends IValidator {
    type: 'afterAnotherDateValidator';
    afterAnotherDateValidator: ICompareWithAnotherControlRule;
}

export interface IAnyValueExceptValidator extends IValidator {
    type: 'anyValueExceptValidator';
    anyValueExceptValidator: {
        except: Array<string>,
        errorMessage: string
    };
}

// export interface IFormValidationRules {
//     dto?: IValidationRules;
//     dtoList?: IValidationRules;
// }

export interface ICurrentControlValidators {
    control: AbstractControl;
    validators: Array<ValidatorFn>;
}
