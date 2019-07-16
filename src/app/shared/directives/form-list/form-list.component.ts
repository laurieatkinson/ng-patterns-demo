import {
    Component,
    EventEmitter,
    forwardRef,
    Injector,
    Input,
    OnInit,
    OnChanges,
    Output,
    ViewEncapsulation,
    ElementRef
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActionCode } from '../../../framework/models/authorization.types';
import { UtilitiesService } from '../../../framework/services/utilities.service';


// This component groups a display or editable list control based on the type of the field
// It also includes any field-level errors
@Component({
    selector: 'la-list',
    templateUrl: './form-list.component.html',
    styleUrls: ['./form-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormListComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => FormListComponent),
            multi: true
        }
    ]
})
export class FormListComponent implements OnInit, OnChanges, ControlValueAccessor {

    selectedValue: any;
    ngControl: NgControl;
    listChoices: Array<{ label: string, value: string | number }>;
    @Input() label: string;
    @Input() dependentFields: string[];
    @Input() filter: false;
    @Input() parentFormGroup;
    @Input() choices: Array<{ label: string, value: string | number }>;
    @Input() includeEmptyChoice: false;
    @Input() emptyChoiceLabel = '- Select -';
    @Input() editMode: boolean;
    @Input() direction: 'horizontal' | 'vertical' = 'vertical';
    @Input() type: 'dropdown' | 'listbox' | 'multiselect' = 'dropdown';
    @Input() tooltip: string;
    @Input() laHideIfUnauthorized: ActionCode;
    @Output() change: EventEmitter<any> = new EventEmitter();

    constructor(private injector: Injector, private elementRef: ElementRef) {
    }

    ngOnInit(): void {
        this.ngControl = this.injector.get(NgControl);
    }
    ngOnChanges() {
        if (this.selectedValue !== undefined) {
            if (this.listChoices &&
                !UtilitiesService.sameListValues(this.choices, this.listChoices)) {
                this.initializeListChoices(this.selectedValue);
            }
        }
    }

    onChange: any = () => { };
    onTouched: any = () => { };

    writeValue(value: any) {
        if (value !== undefined) {
            // If the value changes, remove and errors added by the previous save
            if (this.selectedValue !== value) {
                this.removeServerValidationErrors();
            }

            // If the list choices have not been added yet or
            // if the selected value is not in the list meaning it has been reset,
            // Then need to build the list.
            // Must wait until the selected value is known in order to know
            // whether to use null or '' as the Undefined choice.
            if (!this.listChoices || !this.listChoices.find(item => {
                return item.value == value;
            })) {
                this.initializeListChoices(value);
            }
            this.selectedValue = value;
        }
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
        this.change.subscribe(fn);
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    validate(c: FormControl) {
        return this.ngControl.errors;
    }

    updateValue(event: any) {
        this.removeServerValidationErrors();
        this.selectedValue = event.srcElement.value === 'null' ? null : event.srcElement.value;
        this.onChange(this.selectedValue);
        this.change.next(this.selectedValue);
    }

    updatePrimeNGValue(event: any) {
        this.selectedValue = event.value;
        this.onChange(this.selectedValue);
        this.change.next(this.selectedValue);
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
        const width = this.elementRef.nativeElement.parentElement.clientWidth;
        const maxCharacters = width / 7.1;
        const displayText = this.showSelectedValue().trim();
        return displayText && displayText.length > maxCharacters;
    }

    showSelectedValue() {
        let chosenLabels = '';
        if (this.listChoices) {
            const match = this.listChoices.filter(choice => {
                // If the list is multi-select, the selectedValue is an array
                if (this.selectedValue && this.selectedValue.constructor === Array) {
                    return this.selectedValue.includes(choice.value);
                }
                // If the list allows only one choice, the selectedValue is a string
                return choice.value == this.selectedValue;
            });
            match.forEach((choice, index) => {
                if (index > 0) {
                    chosenLabels += ', ';
                }
                chosenLabels += choice.label;
            });
        }
        return chosenLabels;
    }

    private initializeListChoices(value: any) {
        if (this.choices) {
            this.listChoices = this.choices.slice();
        }
        if (this.includeEmptyChoice) {
            const emptyValue = value === '' ? '' : null;
            if (this.listChoices) {
                this.listChoices.splice(0, 0, { label: this.emptyChoiceLabel, value: emptyValue });
            } else {
                this.listChoices = [{ label: this.emptyChoiceLabel, value: emptyValue }];
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
}
