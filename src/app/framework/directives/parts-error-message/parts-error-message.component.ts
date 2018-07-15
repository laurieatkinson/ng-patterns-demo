import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'la-error-message',
  templateUrl: './parts-error-message.component.html',
  styleUrls: ['./parts-error-message.component.scss']
})
export class PartsErrorMessageComponent {

    @Input() errorList: Array<string> = [];
    @Input() header: string;
}
