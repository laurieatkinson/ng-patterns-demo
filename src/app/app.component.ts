import {
    Event as RouterEvent,
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationStart,
    Router,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './framework/services/auth.service';
import { AuthorizationService } from './framework/services/authorization.service';
import { Component, ViewChild, ElementRef, OnDestroy, OnInit, HostListener } from '@angular/core';
import { GlobalEventsService } from './framework/services/global-events.service';

@Component({
    selector: 'la-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    loading = false;
    loadingDataStarted: Subscription;
    loadingDataComplete: Subscription;
    routingComplete: Subscription;
    lastItemClicked: EventTarget;

    @ViewChild('loadingGif') loadingElement: ElementRef;

    // Keep track of the last thing clicked
    @HostListener('click', ['$event'])
    onclickHander(event: Event) {
        if (event.target) {
            this.lastItemClicked = event.target;
            return true;
        }
    }

    @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHander(event) {

        // No warning popup if logging out
        if (window.location.href.endsWith('logout')) {
            return;
        }

        // No warning popup if opening mail link
        if (this.lastItemClicked && (<HTMLLinkElement>this.lastItemClicked).href &&
            (<HTMLLinkElement>this.lastItemClicked).href.startsWith('mailto:')) {
            return;
        }
        return false;
    }

    constructor(
        private globalEventsService: GlobalEventsService,
        private router: Router,
        private authorizationService: AuthorizationService,
        private authService: AuthService
        ) {
    }

    ngOnInit() {
        this.router.events.subscribe((event: RouterEvent) => {
            this.handleNavigationEvent(event);
        });

        this.loadingDataStarted = this.globalEventsService.loadingDataStarted.subscribe(() => {
            this.showSpinner();
        });

        this.loadingDataComplete = this.globalEventsService.loadingDataComplete.subscribe(() => {
            if (!this.globalEventsService.isBusyRouting) {
                this.hideSpinner();
            }
        });

        this.routingComplete = this.globalEventsService.routingComplete.subscribe(() => {
            this.authService.clearOriginalRoute();
            this.hideSpinner();
        });
    }

    isNotAuthorizedMessageVisible() {
        if (this.loading) {
            return false;
        }
        if (this.authService.isUserAuthenticated) {
            return !this.authorizationService.hasPermission('VIEW');
        } else {
            return false;
        }
    }

    notAuthorizedMessage() {
        return `User "${this.authService.currentUserLoginName}" is not authorized to access this application.`;
    }

    private handleNavigationEvent(event: RouterEvent) {
        if (event instanceof NavigationStart) {
            this.showSpinner();
        } else if (event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError) {
            if (event instanceof NavigationEnd) {
                window.scrollTo(0, 0);
            }
            this.hideSpinner();
        }
    }

    private showSpinner() {
        this.loading = true;
    }

    private hideSpinner() {
        this.loading = false;
    }

    ngOnDestroy() {
        if (this.loadingDataStarted) {
            this.loadingDataStarted.unsubscribe();
        }
        if (this.loadingDataComplete) {
            this.loadingDataComplete.unsubscribe();
        }
        if (this.routingComplete) {
            this.routingComplete.unsubscribe();
        }
    }
}
