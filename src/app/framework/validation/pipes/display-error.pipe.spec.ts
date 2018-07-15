import { DisplayErrorPipe } from './display-error.pipe';

describe('DisplayErrorPipe', () => {
    it('can format a required error message', () => {
        const testValue: Array<string> = [];
        testValue['requiredValidator'] = 'Field is required';

        const pipe = new DisplayErrorPipe();
        const result = pipe.transform(testValue);

        expect(result).toEqual(['Field is required']);
    });

    it('can format a number error message', () => {
        const testValue: Array<string> = [];
        testValue['numberValidator'] = 'Field must be a number';

        const pipe = new DisplayErrorPipe();
        const result = pipe.transform(testValue);

        expect(result).toEqual(['Field must be a number']);
    });

    it('can format a min value error message', () => {
        const testValue: Array<string> = [];
        testValue['minValueValidator'] = 'Value is too small';

        const pipe = new DisplayErrorPipe();
        const result = pipe.transform(testValue);

        expect(result).toEqual(['Value is too small']);
    });

    it('can format a max value error message', () => {
        const testValue: Array<string> = [];
        testValue['maxValueValidator'] = 'Value is too large';

        const pipe = new DisplayErrorPipe();
        const result = pipe.transform(testValue);

        expect(result).toEqual(['Value is too large']);
    });

    it('can format a range value error message', () => {
        const testValue: Array<string> = [];
        testValue['rangeValueValidator'] = 'Value is not within the range';

        const pipe = new DisplayErrorPipe();
        const result = pipe.transform(testValue);

        expect(result).toEqual(['Value is not within the range']);
    });

    it('can format a max length error message', () => {
        const testValue: Array<string> = [];
        testValue['maxLengthValidator'] = 'Value is too long';

        const pipe = new DisplayErrorPipe();
        const result = pipe.transform(testValue);

        expect(result).toEqual(['Value is too long']);
    });

    it('can format a server validation message', () => {
        const testValue: Array<string> = [];
        testValue['serverValidationError'] = 'Error from server';

        const pipe = new DisplayErrorPipe();
        const result = pipe.transform(testValue);

        expect(result).toEqual(['Error from server']);
    });

    it('shows no errors as empty', () => {
        const testValue: Array<string> = null;

        const pipe = new DisplayErrorPipe();
        const result = pipe.transform(testValue);

        expect(result).toBeNull();
    });

    it('can format multiple error messages', () => {
        const testValue: Array<string> = [];
        testValue['numberValidator'] = 'Field must be a number';
        testValue['minValueValidator'] = 'Value is too small';

        const pipe = new DisplayErrorPipe();
        const result = pipe.transform(testValue);

        expect(result).toEqual(['Field must be a number', 'Value is too small']);
    });
});
