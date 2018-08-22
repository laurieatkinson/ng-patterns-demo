import { OnInit } from '@angular/core';
import { Directive, ElementRef, Input } from '@angular/core';
import { AuthorizationService } from '../../services/authorization.service';
import { ActionCode } from '../../models/authorization.types';

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
