import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

// This calendar component is for a standalone value
// If the date is a field on a form, use the form-field control instead
@Component({
    selector: 'la-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
    yearRange: string;
    @Input() selectedDate: Date;
    @Input() placeholder: string;
    @Input() minDate: Date;
    @Input() maxDate: Date;
    @Input() showCalendarOnFocus = false;
    @Input() hideMonthNavigator = false;
    @Input() hideYearNavigator = false;
    @Input() disabled = false;
    @Output() dateSelected: EventEmitter<Date> = new EventEmitter();

    ngOnInit() {
        this.yearRange = '1900:' + ((new Date()).getFullYear() + 10).toString();
    }

    onSelected() {
        this.dateSelected.emit(this.selectedDate);
    }
}
