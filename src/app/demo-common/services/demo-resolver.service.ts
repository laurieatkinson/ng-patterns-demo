import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { AppInjector } from '../../app-injector.service';
import { UtilitiesService } from '../../framework/services/utilities.service';
import { UserSessionService } from './user-session.service';
import { GlobalEventsService } from '../../framework/services/global-events.service';
import { IServerError } from '../../framework/validation/models/server-error.models';
import { SystemMessageService } from '../../framework/services/system-message.service';
import { PostingService } from './posting.service';

@Injectable()
export class DemoResolver {

    protected router: Router;
    protected userSessionService: UserSessionService;
    protected utilitiesService: UtilitiesService;
    protected globalEventsService: GlobalEventsService;
    protected systemMessageService: SystemMessageService;
    protected postingService: PostingService;
    private navigatingToUrl: string;

    constructor() {
        // Manually retrieve the dependencies from the injector
        // so that constructor has no dependencies that need to be passed in from child
        const injector = AppInjector.getInstance().getInjector();
        this.router = injector.get(Router);
        this.utilitiesService = injector.get(UtilitiesService);
        this.userSessionService = injector.get(UserSessionService);
        this.globalEventsService = injector.get(GlobalEventsService);
        this.systemMessageService = injector.get(SystemMessageService);
        this.postingService = injector.get(PostingService);
    }

    resolve(route: ActivatedRouteSnapshot) {
        this.navigatingToUrl = (<any>route)._routerState ? (<any>route)._routerState.url : '';
        this.globalEventsService.startRouting();
        return null;
    }

    routeToNavigationErrorPage(error?: string | IServerError) {
        this.userSessionService.navigationError = {
            navigatingTo: this.navigatingToUrl
        };
        if (typeof error === 'string') {
            this.userSessionService.navigationError.message = error;
        } else {
            this.userSessionService.navigationError.serverError = error;
        }

        if (this.userSessionService.accountCode) {
            // Append a random number so that the routing will redirect even if already on the
            // navigation-error page
            const randomNumber = Math.floor(Math.random() * 1000000000);
            this.router.navigate([
                `/accounts/${this.userSessionService.accountCode}/navigation-error/${randomNumber}`]);
        } else {
            this.router.navigate(['accounts/searchresults']);
        }
        return Promise.resolve(null);
    }
}
