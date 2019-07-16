import { Component, EventEmitter, Input, OnInit, Output, ElementRef, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { SelectItem } from 'primeng/primeng';
import { ActionCode } from '../../../framework/models/authorization.types';
import { UtilitiesService } from '../../../framework/services/utilities.service';

@Component({
  selector: 'la-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InputComponent implements OnInit {

  date: Date;
  days = [];
  selectedMonth: number;
  selectedDay: number;
  yearRange: string;
  @Input() fieldValue: any;
  @Input() disabled = false;
  @Input() label: string;
  @Input() labelOnRight = false;
  @Input() editMode: boolean;
  @Input() type: 'number' | 'number?' | 'date' | 'date?' | 'text' | 'checkbox' | 'radio' | 'number' = 'text';
  @Input() direction: 'vertical' | 'horizontal' = 'vertical';
  @Input() dateFormat = 'shortDate';
  @Input() numberFormat: string;
  @Input() multiline = false;
  @Input() tooltip: string;
  @Input() showCalendarOnFocus = false;
  @Input() hideMonthNavigator = false;
  @Input() hideYearNavigator = false;
  @Input() laHideIfUnauthorized: ActionCode;
  @Input() radioButtonGroup = '';
  @Input() radioValue = '';
  @Input() radioChecked: boolean;
  @Output() changed: EventEmitter<any> = new EventEmitter();
  @Input() selectOptions: SelectItem[];

  constructor(private elementRef: ElementRef) { }

    ngOnInit() {
        this.yearRange = '1900:' + ((new Date()).getFullYear() + 10).toString();
        this.initializeField();
    }

    updateCheckbox(event: any) {
        this.updateField(event.target.checked);
    }

    updateValue(event: any) {
        this.updateField(event.srcElement.value);
    }

    updateField(value: any) {
        // If attempting to assign a numeric value as a string,
        // then first convert it to a number
        if (this.type.startsWith('number') && typeof value === 'string') {
            if (value !== '') {
                const num = Number(value);
                if (!Number.isNaN(num)) {
                    this.fieldValue = num;
                }
            } else {
                if (this.type === 'number') {
                    this.fieldValue = 0;
                } else { // number?
                    this.fieldValue = null;
                }
            }
        } else if (this.type.startsWith('date')) {
            if (value === '' || !UtilitiesService.isValidDateString(value)) {
                if (this.type === 'date') {
                    this.fieldValue = new Date(1900, 0, 1);
                } else { // date?
                    this.fieldValue = null;
                }
            } else {
                this.fieldValue = new Date(value);
            }
        } else {
            this.fieldValue = value;
        }
        this.doneEditing();
    }

    doneEditing() {
        this.changed.emit(this.fieldValue); // allow parent to be notified of change
    }

    updateMonth(event: any) {
        const date = <Date>this.fieldValue;
        date.setMonth(event.target.value);
        this.getDateValues(event.target.value);
        this.selectDate(date);
    }

    updateDay(event: any) {
        const date = <Date>this.fieldValue;
        date.setDate(event.target.value);
        this.selectDate(date);
    }

    selectDate(event: any) {
        this.fieldValue = event;
        this.doneEditing();
    }

    needTooltip() {
        if (!(typeof this.fieldValue === 'string' && this.fieldValue)) {
            return false;
        }
        const width = this.elementRef.nativeElement.parentElement.clientWidth;
        const maxCharacters = width / 7.1;
        return this.fieldValue.trim().length > maxCharacters;
    }

    private initializeField() {
        if (this.type.startsWith('date') && this.fieldValue) {
            const date = <Date>this.fieldValue;
            if (this.dateFormat === 'MM/DD') {
                if (date) {
                    const displayMonth = date.getMonth() + 1;
                    this.getDateValues(displayMonth);
                    this.selectedMonth = displayMonth;
                    this.selectedDay = date.getDate();
                }
            } else {
                this.date = date;
            }
        }
    }

    private getDateValues(month: number) {
        if (this.fieldValue) {
            const date = <Date>this.fieldValue;
            let result = month.toString();
            if (month < 10) {
                result = `0${month}`;
            }
            let daysInMonth = moment(`${date.getFullYear()}-${result.toString()}`, 'YYYY-MM').daysInMonth();

            // Prevent user from selecting 2/29 because the year is always the current year
            // and they may show this control several years from now when it is not a leap year
            if (daysInMonth === 29) {
                daysInMonth = 28;
            }

            this.days = [];
            for (let i = 0; i < daysInMonth; i++) {
                this.days.push(i + 1);
            }
        }
    }
}
