import { Component, Input } from '@angular/core';

@Component({
    selector: 'la-alert',
    templateUrl: './parts-alert.component.html',
    styleUrls: ['./parts-alert.component.css'],
})
export class PartsAlertComponent {

    @Input() showAlert = true;
    @Input() alertType = 'danger';

    toggle() {
        this.showAlert = !this.showAlert;
    }
}
