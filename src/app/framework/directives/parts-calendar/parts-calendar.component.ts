import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';

// This calendar component is for a standalone value
// If the date is a field on a form, use the parts-field control instead
@Component({
    selector: 'la-calendar',
    templateUrl: './parts-calendar.component.html',
    styleUrls: ['./parts-calendar.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PartsCalendarComponent implements OnInit {
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
        //this.updateWithCorrectTimeZone();
        this.dateSelected.emit(this.selectedDate);
    }

    private updateWithCorrectTimeZone() {
        const now = new Date();
        const minuteOffset = now.getTimezoneOffset();
        this.selectedDate.setMinutes(this.selectedDate.getMinutes() + minuteOffset);
    }
}
