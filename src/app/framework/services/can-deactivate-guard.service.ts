import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface ICanComponentDeactivate {
    canDeactivate: (component: ICanComponentDeactivate,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
        nextState?: RouterStateSnapshot) => boolean | Observable<boolean> | Promise<boolean>;
}

// If a component should be checked before navigating away, then this CanDeactivateGuardService
// can be used in the route definition for that component
@Injectable()
export class CanDeactivateGuardService implements CanDeactivate<ICanComponentDeactivate> {
    canDeactivate(component: ICanComponentDeactivate,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
        nextState?: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        if (!component || !component.canDeactivate) {
            return true;
        }
        return component.canDeactivate(component, route, state, nextState);
    }
}
