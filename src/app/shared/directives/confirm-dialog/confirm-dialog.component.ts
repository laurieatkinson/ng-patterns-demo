import { Component, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { ConfirmChoice } from '../../models/confirm-choices.enum';

@Component({
    selector: 'la-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ConfirmDialogComponent {
    display = false;
    @Input() title = 'Please confirm.';
    @Input() message = 'Do you want to save or discard your changes?';
    @Input() okButtonText = 'Save';
    @Input() cancelButtonText = 'Cancel';
    @Input() allowSave = true;
    @Output() confirmed: EventEmitter<ConfirmChoice.save | ConfirmChoice.cancel | number> = new EventEmitter();

    show() {
        this.display = true;
    }
    save() {
        this.display = false;
        this.confirmed.emit(ConfirmChoice.save);
    }
    cancel() {
        if (this.display) {
            this.display = false;
            this.confirmed.emit(ConfirmChoice.cancel);
        }
    }
}
