import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../framework/services/auth-guard.service';
import { CanDeactivateGuardService } from '../framework/services/can-deactivate-guard.service';
import { ChildComponent1Resolver } from './accounts/child-component1/child-component1-resolver.service';
import { SearchResultsComponent } from './search/search-results/search-results.component';
import { SearchResultsResolver } from './search/search-results/search-results-resolver.service';
import { NavigationErrorComponent } from './accounts/shared/components/navigation-error/navigation-error.component';
import { ChildComponent1Component } from './accounts/child-component1/child-component1.component';
import { ChildComponent2Component } from './accounts/child-component2/child-component2.component';
import { ChildComponent2Resolver } from './accounts/child-component2/child-component2-resolver.service';
import { ChildComponent3Resolver } from './accounts/child-component3/child-component3-resolver.service';

const routes: Routes = [
    {
        path: 'accounts',
        canActivate: [AuthGuardService],
        children: [
            {
                path: '',
                data: { actionCode: 'VIEW' },
                children: [
                    {
                        path: 'searchresults',
                        component: SearchResultsComponent,
                        resolve: { searchResults: SearchResultsResolver },
                        canDeactivate: [CanDeactivateGuardService]
                    },
                    {
                        path: ':code/navigation-error/:id',
                        component: NavigationErrorComponent,
                        canDeactivate: [CanDeactivateGuardService]
                    },
                    {
                        path: ':code',
                        component: ChildComponent1Component,
                        resolve: { child1: ChildComponent1Resolver },
                        canDeactivate: [CanDeactivateGuardService]
                    },
                    {
                        path: ':code/child2',
                        component: ChildComponent2Component,
                        resolve: { child2: ChildComponent2Resolver },
                        canDeactivate: [CanDeactivateGuardService]
                    },
                    {
                        path: ':code/child3',
                        component: ChildComponent2Component,
                        resolve: { child3: ChildComponent3Resolver },
                        canDeactivate: [CanDeactivateGuardService]
                    }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DemoRoutingModule { }
