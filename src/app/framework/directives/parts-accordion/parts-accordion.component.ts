import { Component, Directive, Input, ViewEncapsulation } from '@angular/core';
import { PanelModule } from 'primeng/components/panel/panel';

@Component({
    selector: 'la-accordion',
    templateUrl: './parts-accordion.component.html',
    styleUrls: ['./parts-accordion.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PartsAccordionComponent {
    @Input() heading: string;
    @Input() collapsed: boolean;
    @Input() disabled = false;
    @Input() visible = true;

    isCollapsed(): boolean {
        return this.collapsed;
    }
}
