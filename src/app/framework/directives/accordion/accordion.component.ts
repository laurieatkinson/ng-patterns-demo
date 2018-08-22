import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'la-accordion',
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AccordionComponent {
    @Input() heading: string;
    @Input() collapsed: boolean;
    @Input() disabled = false;
    @Input() visible = true;

    isCollapsed(): boolean {
        return this.collapsed;
    }
}
