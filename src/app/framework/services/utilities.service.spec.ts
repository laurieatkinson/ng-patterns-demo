import { TestBed, inject } from '@angular/core/testing';
import { UtilitiesService } from './utilities.service';

describe('UtilitiesService', () => {
    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                UtilitiesService
            ]
        });
    });

    it('should create the service', inject([UtilitiesService], (service: UtilitiesService) => {
        expect(service).toBeTruthy();
    }));

    it('should subtract a day from a date', () => {
        const testDate = new Date('04/22/1990');
        const yesterday = UtilitiesService.subtractDays(testDate, 1);
        expect(yesterday.getDate()).toEqual(21);
    });

    it('should add a day to a date', () => {
        const testDate = new Date('04/22/1990');
        const tomorrow = UtilitiesService.addDays(testDate, 1);
        expect(tomorrow.getDate()).toEqual(23);
    });

    it('can convert date to string', () => {
        const testDate = new Date('04/22/1990');
        const result = UtilitiesService.convertDateToString(testDate, 'MM/DD/YYYY');
        expect(result).toBe('04/22/1990');
    });

    it('can convert string to date', () => {
        const testDate = '04/22/1990';
        const result = UtilitiesService.convertStringToDate(testDate, 'MM/DD/YYYY');
        expect(result.getDate()).toBe(22);
    });
});
