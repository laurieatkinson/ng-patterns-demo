import { FormControl } from '@angular/forms';
import { ControlValidators } from './control-validators.directive';

describe('ControlValidators', () => {
    it('number validator returns an error for a string', () => {
        const control = new FormControl('hello');
        const validator = ControlValidators.numberValidator('invalid');
        const result = validator(control).numberValidator;

        expect(result).toBe('invalid');
    });

    it('number validator returns no error for a number', () => {
        const control = new FormControl('42');
        const validator = ControlValidators.numberValidator('invalid');
        const result = validator(control);

        expect(result).toBeNull();
    });

    it('required validator returns an error for an empty string', () => {
        const control = new FormControl('');
        const validator = ControlValidators.requiredValidator('invalid');
        const result = validator(control).requiredValidator;

        expect(result).toBe('invalid');
    });

    it('required validator returns null for non-empty string', () => {
        const control = new FormControl('hello');
        const validator = ControlValidators.requiredValidator('invalid');
        const result = validator(control);

        expect(result).toBeNull();
    });

    it('minValue validator returns error if too small', () => {
        const control = new FormControl('99');
        const validator = ControlValidators.minValueValidator(100, true, 'invalid');
        const result = validator(control).minValueValidator;

        expect(result).toBe('invalid');
    });

    it('minValue validator returns null if equal', () => {
        const control = new FormControl('100');
        const validator = ControlValidators.minValueValidator(100, true, 'invalid');
        const result = validator(control);

        expect(result).toBeNull();
    });

    it('maxValue validator returns error if too large', () => {
        const control = new FormControl('101');
        const validator = ControlValidators.maxValueValidator(100, true, 'invalid');
        const result = validator(control).maxValueValidator;

        expect(result).toBe('invalid');
    });

    it('maxValue validator returns null if equal', () => {
        const control = new FormControl('100');
        const validator = ControlValidators.minValueValidator(100, true, 'invalid');
        const result = validator(control);

        expect(result).toBeNull();
    });

    it('minDateValue validator returns error if too early', () => {
        const minDate = new Date(2015, 12, 31);
        const testDate = new Date(2015, 10, 31);
        const control = new FormControl(testDate);
        const validator = ControlValidators.minDateValidator(minDate, false, 'invalid');
        const result = validator(control).minDateValidator;

        expect(result).toBe('invalid');
    });

    it('minDateValue validator returns null if valid', () => {
        const minDate = new Date(2015, 12, 31);
        const testDate = new Date(2017, 1, 1);
        const control = new FormControl(testDate);
        const validator = ControlValidators.minDateValidator(minDate, false, 'invalid');
        const result = validator(control);

        expect(result).toBeNull();
    });

    it('maxDateValue validator returns error if too late', () => {
        const maxDate = new Date(2017, 1, 1);
        const testDate = new Date(2017, 1, 2);
        const control = new FormControl(testDate);
        const validator = ControlValidators.maxDateValidator(maxDate, false, 'invalid');
        const result = validator(control).maxDateValidator;

        expect(result).toBe('invalid');
    });

    it('maxDateValue validator returns null if valid', () => {
        const maxDate = new Date(2017, 1, 1);
        const testDate = new Date(2017, 1, 1);
        const control = new FormControl(testDate);
        const validator = ControlValidators.maxDateValidator(maxDate, true, 'invalid');
        const result = validator(control);

        expect(result).toBeNull();
    });

    it('numericRange validator returns null if within range', () => {
        const control = new FormControl('100');
        const validator = ControlValidators.numericRangeValidator(
            { minValue: 0, maxValue: 100, inclusive: true, errorMessage: 'invalid' });
        const result = validator(control);

        expect(result).toBeNull();
    });

    it('numericRange validator returns error if too small', () => {
        const control = new FormControl('0');
        const validator = ControlValidators.numericRangeValidator(
            { minValue: 1, maxValue: 100, inclusive: true, errorMessage: 'invalid' });
        const result = validator(control).rangeValueValidator;

        expect(result).toBe('invalid');
    });

    it('numericRange validator returns error if too large', () => {
        const control = new FormControl('101');
        const validator = ControlValidators.numericRangeValidator(
            { minValue: 1, maxValue: 100, inclusive: true, errorMessage: 'invalid' });
        const result = validator(control).rangeValueValidator;

        expect(result).toBe('invalid');
    });

    it('pattern validator returns no error for valid string', () => {
        const control = new FormControl('abc');
        const validator = ControlValidators.patternValidator('abc', 'invalid');
        const result = validator(control);

        expect(result).toBeNull();
    });

    it('pattern validator returns error for military time', () => {
        const control = new FormControl('88:88');
        const validator = ControlValidators.patternValidator(
            '([01]\\d|2[0-3]):?([0-5]\\d)', 'invalid');
        const result = validator(control).patternValidator;

        expect(result).toBe('invalid');
    });

    it('pattern validator returns no error for valid military time', () => {
        const control = new FormControl('23:59');
        const validator = ControlValidators.patternValidator(
            '([01]\\d|2[0-3]):?([0-5]\\d)', 'invalid');
        const result = validator(control);

        expect(result).toBeNull();
    });

    it('pattern validator returns no error for valid 7-digit phone number', () => {
        const control = new FormControl('555-1212');
        const validator = ControlValidators.patternValidator(
            '(\\d{3})-(\\d{4})', 'invalid');
        const result = validator(control);

        expect(result).toBeNull();
    });

    it('pattern validator returns error for invalid 7-digit phone number', () => {
        const control = new FormControl('555-12122');
        const validator = ControlValidators.patternValidator(
            '(\\d{3})-(\\d{4})', 'invalid');
        const result = validator(control).patternValidator;

        expect(result).toBe('invalid');
    });

    it ('anyValueExceptValidator returns error for 4-character blanks', () => {
        const control = new FormControl('    ');
        const validator = ControlValidators.anyValueExceptValidator(
            ['    '], 'invalid');
        const result = validator(control).anyValueExceptValidator;

        expect(result).toBe('invalid');
    });

    it ('anyValueExceptValidator returns null for other string', () => {
        const control = new FormControl('TEST');
        const validator = ControlValidators.anyValueExceptValidator(
            ['    '], 'invalid');
        const result = validator(control);

        expect(result).toBeNull();
    });
});
