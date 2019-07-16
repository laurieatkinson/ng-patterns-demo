import { fakeAsync } from '@angular/core/testing';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { CalendarComponent } from './calendar.component';
import { TestInjector } from '../../../demo-common/testing/testing-helpers';

describe('CalendarComponent', () => {
    let component: CalendarComponent;
    beforeAll(() => {
        TestInjector.setInjector();
    });

    beforeEach(() => {
        component = new CalendarComponent();
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
