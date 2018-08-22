import { Component, Input } from '@angular/core';

@Component({
  selector: 'la-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent {

    @Input() errorList: Array<string> = [];
    @Input() header: string;
}
