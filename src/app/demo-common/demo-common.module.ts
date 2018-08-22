import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FrameworkModule } from '../framework/framework.module';
import { HeaderBarComponent } from './directives/header-bar/header-bar.component';
import { TopNavComponent } from './directives/top-nav/top-nav.component';
import { TransactionDataService } from './services/transaction-data.service';
import { TransactionService } from './services/transaction.service';
import { TransactionEntityDataService } from './services/transaction-entity-data.service';
import { SearchDataService } from './services/search-data.service';
import { SearchService } from './services/search.service';
import { UserSessionService } from './services/user-session.service';
import { ComponentHeaderComponent } from './directives/component-header/component-header.component';
import { DemoCommonDataService } from './services/demo-common-data.service';
import { TransactionConfirmDialogComponent } from './directives/transaction-confirm-dialog/transaction-confirm-dialog.component';

@NgModule({
    imports: [
        RouterModule,
        FrameworkModule
    ],
    declarations: [
        TopNavComponent,
        HeaderBarComponent,
        TransactionConfirmDialogComponent,
        ComponentHeaderComponent
    ],
    providers: [
        UserSessionService,
        DemoCommonDataService,
        TransactionEntityDataService,
        TransactionDataService,
        TransactionService,
        SearchDataService,
        SearchService
    ],
    exports: [
        TopNavComponent,
        HeaderBarComponent,
        TransactionConfirmDialogComponent,
        ComponentHeaderComponent
    ]
})
export class DemoCommonModule {
}
