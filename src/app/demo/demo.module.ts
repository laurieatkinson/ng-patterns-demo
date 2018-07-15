import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FrameworkModule } from '../framework/framework.module';
import { DemoCommonModule } from '../demo-common/demo-common.module';
import { DemoRoutingModule } from './demo-routing.module';
import { PlanUpdateService } from './accounts/shared/services/plan-update.service';
import { AccountDataService } from './accounts/shared/services/account-data.service';
import { AccountHeaderService } from './accounts/shared/directives/account-header/account-header.service';
import { PlanMenuService } from './accounts/shared/services/plan-menu.service';
import { DemoTransactionComponent } from './accounts/shared/components/demo-transaction-component';
import { AccountHeaderComponent } from './accounts/shared/directives/account-header/account-header.component';
import { ChildComponent1Resolver } from './accounts/child-component1/child-component1-resolver.service';
import { SearchResultsComponent } from './search/search-results/search-results.component';
import { SearchResultsResolver } from './search/search-results/search-results-resolver.service';
import { Child3DataService } from './accounts/shared/services/child3-data.service';
import { PlanHeaderMenuComponent } from './accounts/shared/directives/plan-header-menu/plan-header-menu.component';
import { Child2DataService } from './accounts/shared/services/child2-data.service';
import { NavigationErrorComponent } from './accounts/shared/components/navigation-error/navigation-error.component';
import { ChildComponent1Component } from './accounts/child-component1/child-component1.component';
import { Child1DataService } from './accounts/shared/services/child1-data.service';
import { ChildComponent2Component } from './accounts/child-component2/child-component2.component';
import { ChildComponent2Resolver } from './accounts/child-component2/child-component2-resolver.service';
import { ChildComponent3Component } from './accounts/child-component3/child-component3.component';
import { ChildComponent3Resolver } from './accounts/child-component3/child-component3-resolver.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FrameworkModule,
        DemoCommonModule,
        DemoRoutingModule
    ],
    declarations: [
        DemoTransactionComponent,
        ChildComponent1Component,
        ChildComponent2Component,
        ChildComponent3Component,
        AccountHeaderComponent,
        SearchResultsComponent,
        PlanHeaderMenuComponent,
        NavigationErrorComponent
    ],
    providers: [
        AccountDataService,
        PlanUpdateService,
        AccountHeaderService,
        ChildComponent1Resolver,
        ChildComponent2Resolver,
        ChildComponent3Resolver,
        SearchResultsResolver,
        Child1DataService,
        Child2DataService,
        Child3DataService,
        PlanMenuService
    ],
    exports: [
    ]
})
export class DemoModule { }
