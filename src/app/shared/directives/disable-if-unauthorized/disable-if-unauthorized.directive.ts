import { OnInit } from '@angular/core';
import { Directive, ElementRef, Input } from '@angular/core';
import { ActionCode } from '../../../framework/models/authorization.types';
import { AuthorizationService } from '../../../framework/services/authorization.service';

@Directive({
    selector: '[laDisableIfUnauthorized]'
})
export class DisableIfUnauthorizedDirective implements OnInit {
    @Input('laDisableIfUnauthorized') permission: ActionCode;

    constructor(private el: ElementRef, private authorizationService: AuthorizationService) {
    }

    ngOnInit() {
        if (!this.authorizationService.hasPermission(this.permission)) {
            this.el.nativeElement.disabled = true;
        }
    }
}
