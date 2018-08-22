import { FormGroup, AbstractControl } from '@angular/forms';
import { Component, Output, Input, EventEmitter } from '@angular/core';
import { ActionCode } from '../../../framework/models/authorization.types';

@Component({
    selector: 'la-component-header',
    templateUrl: './component-header.component.html',
    styleUrls: ['./component-header.component.scss']
})
export class ComponentHeaderComponent {

    @Input() title: string;
    @Input() isEditable = false;
    @Input() disabled: boolean;
    @Input() form: FormGroup;
    @Input() updatePermission: ActionCode = 'UPDATE';
    @Input() customInvalid = false;
    @Output() toggleEdit = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<boolean>();
    isAccountReadOnly = false;

    isEditDisabled(): boolean {
        if (this.disabled) {
            return true;
        } else {
            return this.isAccountReadOnly;
        }
    }

    toggle() {
        this.toggleEdit.emit(!this.isEditable);
    }

    save() {
        this.onSave.emit();
    }

    formInvalid() {
        if (!this.form || !this.form.invalid) {
            return false;
        }

        let invalid = false; // default to valid

        Object.keys(this.form.controls).forEach(fieldName => {
            if (this.form.controls[fieldName] instanceof FormGroup) {
                Object.keys((<FormGroup>this.form.controls[fieldName]).controls).forEach(fldName => {
                    if (this.anyControlsInvalid((<FormGroup>this.form.controls[fieldName]).controls[fldName])) {
                        invalid = true;
                    }
                });
            } else {
                if (this.anyControlsInvalid(this.form.controls[fieldName])) {
                    invalid = true;
                }
            }

        });
        return invalid;
    }

    private anyControlsInvalid(control: AbstractControl) {
        let invalidFound = false;
        // check if the only errors also are listed as warnings
        if (control.errors) {
            Object.keys(control.errors).forEach(errorKey => {
                // If any errors on this field and none of them are warning or
                // one of the errors matches none of the warnings, then form is invalid
                if (!(<any>control).warnings ||
                    !((<any>control).warnings.includes(errorKey))) {
                    invalidFound = true;
                }
            });
        }
        return invalidFound;
    }
}
