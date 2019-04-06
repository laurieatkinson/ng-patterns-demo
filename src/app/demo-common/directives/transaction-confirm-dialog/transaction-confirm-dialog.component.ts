import { Component, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { ConfirmDialogComponent } from '../../../framework/directives/confirm-dialog/confirm-dialog.component';
import { ConfirmChoice } from '../../../framework/models/confirm-choices.enum';

@Component({
    selector: 'la-transaction-confirm-dialog',
    templateUrl: './transaction-confirm-dialog.component.html',
    styleUrls: ['./transaction-confirm-dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TransactionConfirmDialogComponent extends ConfirmDialogComponent {
    description = '';
    @Input() confirm = false;
    @Input() allowDiscard = true;
    @Output() confirmed: EventEmitter<ConfirmChoice.save | ConfirmChoice.cancel | ConfirmChoice.discard> = new EventEmitter();

    saveButtonText() {
        if (this.allowSave && this.confirm) {
            return 'Save and commit';
        } else if (this.allowSave) {
            return 'Save';
        } else if (this.confirm) {
            return 'Commit';
        }
        return '';
    }

    discard() {
        this.display = false;
        this.confirmed.emit(ConfirmChoice.discard);
    }
}
