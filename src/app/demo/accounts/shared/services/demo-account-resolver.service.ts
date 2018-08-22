import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { DemoResolver } from '../../../../demo-common/services/demo-resolver.service';

@Injectable()
export class DemoAccountResolver extends DemoResolver {

    resolve(route: ActivatedRouteSnapshot) {
        const accountCode = route.params['code'];
        this.userSessionService.accountCode = accountCode;
        return super.resolve(route);
    }
}
