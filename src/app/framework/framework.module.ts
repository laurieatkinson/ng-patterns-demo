import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from './services/auth-guard.service';
import { UtilitiesService } from './services/utilities.service';
import { GlobalEventsService } from './services/global-events.service';
import { CanDeactivateGuardService } from './services/can-deactivate-guard.service';
import { FormBuilderService } from './services/form-builder.service';
import { ErrorHandlerService } from './errorhandling/error-handler.service';
import { ErrorUtilitiesService } from './errorhandling/error-utilities.service';
import { MetadataDataService } from './services/metadata-data.service';
import { MetadataService } from './services/metadata.service';
import { LoggingService } from './logging/logging.service';
import { AuthorizationService } from './services/authorization.service';
import { AuthorizationDataService } from './services/authorization-data.service';
import { SystemMessageService } from './services/system-message.service';
import { SystemMessageDataService } from './services/system-message-data.service';
import { BaseComponent } from './components/base-component';
import { ValidationModule } from './validation/validation.module';
import { AdalService } from 'adal-angular4';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        ValidationModule
    ],
    declarations: [
        BaseComponent
    ],
    providers: [
        GlobalEventsService,
        AdalService,
        AuthGuardService,
        CanDeactivateGuardService,
        FormBuilderService,
        ErrorHandlerService,
        AuthorizationService,
        AuthorizationDataService,
        UtilitiesService,
        ErrorUtilitiesService,
        LoggingService,
        MetadataDataService,
        MetadataService,
        SystemMessageService,
        SystemMessageDataService,
        { provide: ErrorHandler, useClass: ErrorHandlerService }
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class FrameworkModule {
}
