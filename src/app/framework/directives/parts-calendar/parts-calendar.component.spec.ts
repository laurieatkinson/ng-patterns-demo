import { CommonModule } from '@angular/common';
import { async, fakeAsync } from '@angular/core/testing';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { PartsCalendarComponent } from './parts-calendar.component';
import { TestInjector } from '../../../demo-common/testing/testing-helpers';

describe('PartsCalendarComponent', () => {
    let component: PartsCalendarComponent;
    beforeAll(() => {
        TestInjector.setInjector();
    });

    beforeEach(() => {
        component = new PartsCalendarComponent();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit the selected date', fakeAsync((): void => {
        const testDate = new Date('04/22/1989');
        spyOn(component.dateSelected, 'emit');
        component.selectedDate = testDate;
        component.onSelected();
        expect(component.dateSelected.emit).toHaveBeenCalledWith(testDate);
    }));
});
