import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FrameworkModule } from '../framework/framework.module';
import { HeaderBarComponent } from './directives/header-bar/header-bar.component';
import { PostingConfirmDialogComponent } from './directives/posting-confirm-dialog/posting-confirm-dialog.component';
import { TopNavComponent } from './directives/top-nav/top-nav.component';
import { TransactionDataService } from './services/transaction-data.service';
import { PostingService } from './services/posting.service';
import { PostingEntityDataService } from './services/posting-entity-data.service';
import { SearchDataService } from './services/search-data.service';
import { SearchService } from './services/search.service';
import { UserSessionService } from './services/user-session.service';
import { ComponentHeaderComponent } from './directives/component-header/component-header.component';
import { DemoCommonDataService } from './services/demo-common-data.service';

@NgModule({
    imports: [
        RouterModule,
        FrameworkModule
    ],
    declarations: [
        TopNavComponent,
        HeaderBarComponent,
        PostingConfirmDialogComponent,
        ComponentHeaderComponent
    ],
    providers: [
        UserSessionService,
        DemoCommonDataService,
        PostingEntityDataService,
        TransactionDataService,
        PostingService,
        SearchDataService,
        SearchService
    ],
    exports: [
        TopNavComponent,
        HeaderBarComponent,
        PostingConfirmDialogComponent,
        ComponentHeaderComponent
    ]
})
export class DemoCommonModule {
}
