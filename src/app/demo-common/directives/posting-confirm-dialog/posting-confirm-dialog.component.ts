import { Component, ViewEncapsulation, EventEmitter, Output, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { PartsConfirmDialogComponent } from '../../../framework/directives/parts-confirm-dialog/parts-confirm-dialog.component';
import { ConfirmChoice } from '../../../framework/models/confirm-choices.enum';

@Component({
    selector: 'la-posting-confirm-dialog',
    templateUrl: './posting-confirm-dialog.component.html',
    styleUrls: ['./posting-confirm-dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PostingConfirmDialogComponent extends PartsConfirmDialogComponent {
    description = '';
    @Input() confirm = false;
    @Input() allowDiscard = true;
    protected confirmedSource = new Subject<ConfirmChoice.save | ConfirmChoice.cancel | ConfirmChoice.discard>();

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
        this.confirmedSource.next(ConfirmChoice.discard);
    }
}
