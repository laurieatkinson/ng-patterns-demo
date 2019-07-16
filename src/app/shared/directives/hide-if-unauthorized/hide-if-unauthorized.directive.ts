import { OnInit } from '@angular/core';
import { Directive, ElementRef, Input } from '@angular/core';
import { ActionCode } from '../../../framework/models/authorization.types';
import { AuthorizationService } from '../../../framework/services/authorization.service';

@Directive({
    selector: '[laHideIfUnauthorized]'
})
export class HideIfUnauthorizedDirective implements OnInit {
    @Input('laHideIfUnauthorized') permission: ActionCode;

    constructor(private el: ElementRef, private authorizationService: AuthorizationService) {
    }

    ngOnInit() {
        if (!this.authorizationService.hasPermission(this.permission)) {
            this.el.nativeElement.style.display = 'none';
        }
    }
}
