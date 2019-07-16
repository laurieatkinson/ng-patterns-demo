import { DateToStringPipe } from './date-to-string.pipe';

describe('DateToStringPipe', () => {
    it('can format a date to shortDate', () => {
        const testValue = new Date(2001, 0, 2);
        const pipe = new DateToStringPipe();
        const result = pipe.transform(testValue, 'shortDate');

        expect(result).toEqual('01/02/01');
    });

    it('can format a date to as MM/DD/YYYY', () => {
        const testValue = new Date(2001, 0, 2);
        const pipe = new DateToStringPipe();
        const result = pipe.transform(testValue, 'MM/DD/YYYY');

        expect(result).toEqual('01/02/2001');
    });


    it('can return empty on invalid date', () => {
        const testValue = 'pancakes';
        const pipe = new DateToStringPipe();
        const result = pipe.transform(<any>testValue, 'shortDate');

        expect(result).toEqual('');
    });

    it('can format MM-DD', () => {
        const testValue = new Date(2001, 0, 2);
        const pipe = new DateToStringPipe();
        const result = pipe.transform(testValue, 'MM-DD');

        expect(result).toEqual('01-02');
    });
});
