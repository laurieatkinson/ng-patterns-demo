import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DemoTransactionComponent } from '../demo-transaction-component';

@Component({
  selector: 'la-navigation-error',
  templateUrl: './navigation-error.component.html',
  styleUrls: ['./navigation-error.component.scss']
})
export class NavigationErrorComponent extends DemoTransactionComponent implements OnInit, OnDestroy {

    header: string;

    constructor(protected route: ActivatedRoute) {
        super(route);
    }

    ngOnInit() {
        this.eventSubscriptions.push(this.route.params
          .subscribe(params => {
            const accountCode = params['code'];
            if (!accountCode || accountCode.toLowerCase() === 'undefined') {
                this.router.navigate(['accounts/searchresults']);
            } else {
                this.errorsFromServer = [];
                this.header = '';
                if (this.userSessionService.navigationError) {
                    this.errorsFromServer =
                        this.errorUtilitiesService.parseNavigationError(this.userSessionService.navigationError);
                    if (this.userSessionService.navigationError.navigatingTo) {
                        this.header = `Unable to navigate to the requested URL: ${this.userSessionService.navigationError.navigatingTo}`;
                    }
                    this.userSessionService.navigationError = null;
                }
                super.ngOnInit();
            }
        }));
    }
}
