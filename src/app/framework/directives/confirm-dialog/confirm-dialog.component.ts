import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
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
    protected confirmedSource = new Subject<ConfirmChoice.save | ConfirmChoice.cancel | number>();
    confirmed = this.confirmedSource.asObservable();

    show() {
        this.display = true;
    }
    save() {
        this.display = false;
        this.confirmedSource.next(ConfirmChoice.save);
    }
    cancel() {
        if (this.display) {
            this.display = false;
            this.confirmedSource.next(ConfirmChoice.cancel);
        }
    }
}
