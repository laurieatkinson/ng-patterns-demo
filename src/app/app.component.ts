import {
    Event as RouterEvent,
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationStart,
    Router,
} from '@angular/router';
import { Component, OnDestroy, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdalService } from 'adal-angular4';
import { GlobalEventsService } from './framework/services/global-events.service';
import { AppConfig } from './app.config';

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
        private changeDetectorRef: ChangeDetectorRef,
        private adalService: AdalService
        ) {
        const adalConfig: adal.Config = {
            tenant: AppConfig.settings.aad.tenant,
            clientId: AppConfig.settings.aad.clientId,
            redirectUri: window.location.origin,
            navigateToLoginRequestUrl: true,
            endpoints: AppConfig.settings.aad.endpoints
        };
        adalService.init(adalConfig);
        this.adalService.handleWindowCallback();
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
            this.hideSpinner();
        });
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
        if (!this.loading) {
            this.loading = true;
            this.changeDetectorRef.detectChanges();
        }
    }

    private hideSpinner() {
        if (this.loading) {
            this.loading = false;
            this.changeDetectorRef.detectChanges();
        }
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
