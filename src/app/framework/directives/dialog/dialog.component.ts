import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'la-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogComponent {
    @Input() visible = false;
    @Input() title = 'Please confirm.';
    @Input() width: any;
    @Input() height: any;
    @Output() onHide: EventEmitter<any> = new EventEmitter();
    @Output() onShow: EventEmitter<any> = new EventEmitter();

    show() {
        this.visible = true;
    }

    showDialog() {
      this.onShow.emit();
    }

    hide() {
      this.onHide.emit();
    }
}
