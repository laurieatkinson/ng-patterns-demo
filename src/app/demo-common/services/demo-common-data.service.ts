import { HttpClient } from '@angular/common/http';
import { AppInjector } from '../../app-injector.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserSessionService } from './user-session.service';
import { PostingService } from './posting.service';
import { GlobalEventsService } from '../../framework/services/global-events.service';
import { PartsLoggingService } from '../../framework/logging/parts-logging.service';
import { UtilitiesService } from '../../framework/services/utilities.service';
import { AuthService } from '../../framework/services/auth.service';
import { DataService } from '../../framework/services/data.service';

@Injectable()
export class DemoCommonDataService extends DataService {

    // Add any dependencies that are in parts-common, but not in the framework
    protected userSessionService: UserSessionService;

    constructor() {
        // Manually retrieve the dependencies from the injector
        // so that constructor has no dependencies that need to be passed in from child
        const injector = AppInjector.getInstance().getInjector();
        const http = injector.get(HttpClient);
        const authService = injector.get(AuthService);
        const utilitiesService = injector.get<UtilitiesService>(UtilitiesService);
        const partsLoggingService = injector.get(PartsLoggingService);
        const globalEventsService = injector.get(GlobalEventsService);
        const router = injector.get(Router);

        super(http, authService, utilitiesService, partsLoggingService, globalEventsService, router);

        this.userSessionService = injector.get(UserSessionService);
    }
}
