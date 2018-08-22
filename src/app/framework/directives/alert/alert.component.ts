import { Component, Input } from '@angular/core';

@Component({
    selector: 'la-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css'],
})
export class AlertComponent {

    @Input() showAlert = true;
    @Input() alertType = 'danger';

    toggle() {
        this.showAlert = !this.showAlert;
    }
}
