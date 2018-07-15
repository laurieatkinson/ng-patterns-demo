import { Component, EventEmitter, forwardRef, Injector, Input, OnInit, OnChanges,
         Output, ViewEncapsulation, ElementRef, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import * as moment from 'moment';
import { Tooltip } from 'primeng/primeng';
import { ActionCode } from '../../models/authorization.types';
import { UtilitiesService } from '../../services/utilities.service';

// This component groups a display or editable control based on the type of the field
// It also includes any field-level errors
@Component({
    selector: 'la-field',
    templateUrl: './parts-field.component.html',
    styleUrls: ['./parts-field.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PartsFieldComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => PartsFieldComponent),
            multi: true
        }
    ]
})
export class PartsFieldComponent implements OnInit, OnChanges, ControlValueAccessor {

    fieldValue: any;
    originalValue: any;
    date: Date;
    maskFieldValue: string;
    ngControl: NgControl;
    days = [];
    selectedMonth: number;
    selectedDay: number;
    yearRange: string;
    minDate: Date;
    @Input() label: string;
    @Input() parentFormGroup;
    @Input() dependentFields: string[];
    @Input() editMode: boolean;
    @Input() type: 'number' | 'number?' | 'date' | 'date?' | 'text' | 'checkbox' | 'radio' = 'text';
    @Input() direction: 'vertical' | 'horizontal' = 'vertical';
    @Input() labelOnRight = false;
    @Input() dateFormat = 'MM/DD/YYYY'; // 'shortDate';
    @Input() numberFormat: string;
    @Input() multiline = false;
    @Input() showCalendarOnFocus = false;
    @Input() hideMonthNavigator = false;
    @Input() hideYearNavigator = false;
    @Input() tooltip: string;
    @Input() mask = '';
    @Input() useUnmaskedValue = false;
    @Input() pnHideIfUnauthorized: ActionCode;
    @Input() radioButtonGroup = '';
    @Input() radioValue = '';
    @Input() radioChecked: boolean;
    @Input() readOnlyWithValidation = false;
    @Output() change: EventEmitter<any> = new EventEmitter();

    onChange: any = () => { };
    onTouched: any = () => { };

    constructor(private injector: Injector, private elementRef: ElementRef) {
    }

    ngOnInit() {
        this.yearRange = '1900:' + ((new Date()).getFullYear() + 10).toString();
        this.minDate = new Date(1900, 0, 1);
        this.ngControl = this.injector.get(NgControl);
    }

    ngOnChanges(changes: SimpleChanges) {
        // If the type of the field change, e.g. from text to date,
        // then must reinitialize everything for this field
        if (changes.type && changes.type.previousValue) {
            this.initializeField(this.fieldValue);
        }
    }

    // called by Angular when the value of the control is set either by the parent component or form
    writeValue(value: any) {
        this.initializeField(value);
    }

    // Register a handler that should be called when something in the view has changed.
    registerOnChange(fn: any) {
        this.onChange = fn;
        this.change.subscribe(fn);
    }

    // Register a handler that should be called when an element has been touched.
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    validate(c: FormControl) {
        return this.ngControl.errors;
    }

    updateValue(event: Event) {
        const value = (<HTMLInputElement>event.srcElement).value;
        this.updateField(value, event);
    }

    // Extra method to allow unit testing of update
    updateField(value: any, event?: Event) {
        if (this.fieldValue !== value) {
            this.removeServerValidationErrors();
        }

        if (this.type.startsWith('number')) {
            if (value === '') {
                if (this.type === 'number') {
                    if (event) {
                        (<HTMLInputElement>event.srcElement).value = '0';
                    }
                    this.fieldValue = 0;
                } else { // number?
                    this.fieldValue = null;
                }
            } else {
                const num = Number(value);
                if (!Number.isNaN(num)) {
                    this.fieldValue = num;
                }
            }
        } else if (this.type.startsWith('date')) {
            if (value === '' || !UtilitiesService.isDate(new Date(value)) ||
                UtilitiesService.isBeforeDate(value, this.minDate)) {
                if (this.type === 'date') {
                    this.date = new Date(1900, 0, 1);
                } else { // date?
                    this.date = null;
                }
            } else {
                this.date = new Date(value);
            }
            this.fieldValue = this.date;
        // InputMask does not have an input or change event to call this method
        // } else if (this.mask) {
        //    this.fieldValue = this.maskFieldValue;
        } else {
            this.fieldValue = value;
        }

        this.onChange(this.fieldValue);
    }

    updateCheckedValue(event: any) {
        this.fieldValue = !this.fieldValue;
        this.removeServerValidationErrors();
        this.onChange(this.fieldValue);
    }

    updateMonth(event: any) {
        const userModified = !!event.target;
        let date = <Date>this.fieldValue;
        let month: number;
        if (userModified) {
            month = event.target.value;
        } else {
            month = event;
        }

        if (!date) {
            date = new Date(1900, 1, 1);
        }

        // If selected a month with fewer days than previous month, then
        // must adjust in order to be able to set the new month
        const lastDayOfMonth = this.getDaysInMonth(date, month);
        if (this.selectedDay > lastDayOfMonth) {
            this.selectedDay = lastDayOfMonth;
            date.setDate(this.selectedDay);
        }
        date.setMonth(month - 1);
        this.getDateValues(date, month);

        if (userModified) {
            this.selectDate(date);
        }
    }

    updateDay(event: any) {
        // const date = new Date(this.fieldValue);
        const date = <Date>this.fieldValue;
        date.setDate(event.target.value);
        this.selectDate(date);
    }

    selectDate(event: any) {
        event = <Date>event.setHours(0, 0, 0);
        this.fieldValue = event;
        this.onChange(this.fieldValue);
        this.doneEditing();
    }

    doneEditing() {
        if (this.mask) {
            this.fieldValue = this.maskFieldValue;
        }
        // Must manually remove server validation errors when the field changes
        // because the client doesn't know how to validate it
        if (this.fieldValue !== this.originalValue &&
            this.ngControl.errors && this.ngControl.errors.serverValidationError) {
            delete this.ngControl.errors.serverValidationError;
        }
        this.change.next(this.fieldValue); // allow parent to be notified of change
    }

    tooltipToShow() {
        if (this.tooltip) {
            return this.tooltip;
        }
        if (this.ngControl.control) {
            return (<any>this.ngControl.control).tooltip;
        }
    }

    needTooltipForChoppedOffValue() {
        if (!(typeof this.fieldValue === 'string' && this.fieldValue)) {
            return false;
        }
        const width = this.elementRef.nativeElement.parentElement.clientWidth;
        const maxCharacters = width / 7.1;
        return this.fieldValue.trim().length > maxCharacters;
    }

    fieldValueWhenNotEditing() {
        // mask: (999) 999-9999
        // fieldValue: 3035551212
        // return (303) 555-1212
        if (this.type === 'text' && this.mask && this.useUnmaskedValue && this.fieldValue) {
            const fieldValue = (<string>this.fieldValue);
            let result = '';
            for (let i = 0, next = 0; i < this.mask.length; i++) {
                if (this.mask.charAt(i) !== '9') { // Currently, all the masks are for numbers || /\w/.test(char)) {
                    result = result.concat(this.mask.charAt(i));
                } else {
                    // Get the next character
                    if (fieldValue.length <= next) {
                        return this.fieldValue;
                    }
                    result = result.concat(fieldValue.charAt(next));
                    next++;
                }
            }
            return result;
        }
        return this.fieldValue;
    }

    fixTimeForDatePipeBug(fieldValue) {
        return UtilitiesService.fixTimeForDatePipeBug(fieldValue);
    }

    private initializeField(value: any) {
        this.date = null;
        if (this.originalValue === undefined ) {
            if (!this.type.startsWith('date')) {
                this.originalValue = value;
            } else if (this.type.startsWith('date') && value) {
                this.originalValue = new Date(value);
            }
        }

        if (value !== undefined) {
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
                if (value instanceof Date && !isNaN(value.getTime())) { // valid Date
                    this.date = value;
                } else {
                    if (this.type === 'date') {
                        this.date = new Date(1900, 0, 1);
                    } else { // date?
                        this.date = null;
                    }
                }

                this.fieldValue = value;

                if (this.dateFormat === 'MM/DD') {
                    if (this.fieldValue) {
                        const date = <Date>this.fieldValue;
                        date.setFullYear(1900);
                        const displayMonth = date.getMonth() + 1;
                        this.getDateValues(date, displayMonth);
                        this.selectedMonth = displayMonth;
                        this.updateMonth(this.selectedMonth);
                        this.selectedDay = date.getDate();
                    } else {
                        this.selectedMonth = null;
                        this.selectedDay = null;
                    }
                }
            } else if (this.mask) {
                this.maskFieldValue = value;
                this.fieldValue = value;
            } else {
                this.fieldValue = value;
            }
        }
    }

    private removeServerValidationErrors() {
        // Must manually remove server validation errors when the field changes
        // because the client doesn't know how to validate it
        if (this.ngControl.errors && this.ngControl.errors.hasOwnProperty('serverValidationError')) {
            delete this.ngControl.errors.serverValidationError;
        }
        if (!this.parentFormGroup && this.ngControl.control) {
            this.parentFormGroup = this.ngControl.control.parent;
        }
        if (this.dependentFields && this.parentFormGroup) {
            this.dependentFields.forEach(dependentField => {
                const control = this.parentFormGroup.controls[dependentField];
                if (control && control.errors && control.errors.hasOwnProperty('serverValidationError')) {
                    delete control.errors.serverValidationError;
                    control.updateValueAndValidity();
                }
            });
        }
    }

    private getDateValues(date: Date, month: number) {
        const daysInMonth = this.getDaysInMonth(date, month);
        this.days = [];
        for (let i = 1; i <= daysInMonth; i++) {
            this.days.push(i);
        }
    }

    private getDaysInMonth(date: Date, month: number) {
        let result = month.toString();
        if (month < 10) {
            result = `0${month}`;
        }
        const daysInMonth = moment(`${date.getFullYear()}-${result.toString()}`, 'YYYY-MM').daysInMonth();

        // Prevent user from selecting 2/29 because the year is always the current year
        // and they may show this control several years from now when it is not a leap year
        if (daysInMonth === 29) {
            return 28;
        }
        return daysInMonth;
    }
}
