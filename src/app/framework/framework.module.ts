import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/components/dialog/dialog';
import { ButtonModule } from 'primeng/components/button/button';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { ListboxModule } from 'primeng/components/listbox/listbox';
import { MultiSelectModule } from 'primeng/components/multiselect/multiselect';
import { PanelModule } from 'primeng/components/panel/panel';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { MegaMenuModule } from 'primeng/components/megamenu/megamenu';
import { TieredMenuModule } from 'primeng/components/tieredmenu/tieredmenu';
import { PanelMenuModule } from 'primeng/components/panelmenu/panelmenu';
import { OrderListModule } from 'primeng/components/orderlist/orderlist';
import { PickListModule } from 'primeng/components/picklist/picklist';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { InputMaskModule } from 'primeng/components/inputmask/inputmask';
import { MenuModule } from 'primeng/components/menu/menu';

import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { UtilitiesService } from './services/utilities.service';
import { GlobalEventsService } from './services/global-events.service';
import { CanDeactivateGuardService } from './services/can-deactivate-guard.service';
import { PartsFormBuilderService } from './services/parts-form-builder.service';
import { PartsErrorHandlerService } from './errorhandling/parts-error-handler.service';
import { ErrorUtilitiesService } from './errorhandling/error-utilities.service';
import { MetadataDataService } from './services/metadata-data.service';
import { MetadataService } from './services/metadata.service';
import { PartsLoggingService } from './logging/parts-logging.service';
import { AuthorizationService } from './services/authorization.service';
import { AuthorizationDataService } from './services/authorization-data.service';
import { SystemMessageService } from './services/system-message.service';
import { SystemMessageDataService } from './services/system-message-data.service';
import { BaseComponent } from './components/base-component';
import { PartsAccordionComponent } from './directives/parts-accordion/parts-accordion.component';
import { PartsAlertComponent } from './directives/parts-alert/parts-alert.component';
import { PartsCalendarComponent } from './directives/parts-calendar/parts-calendar.component';
import { PartsConfirmDialogComponent } from './directives/parts-confirm-dialog/parts-confirm-dialog.component';
import { PartsDataTableComponent } from './directives/parts-data-table/parts-data-table.component';
import { PartsFieldComponent } from './directives/parts-field/parts-field.component';
import { PartsListComponent } from './directives/parts-list/parts-list.component';
import { PartsMenuComponent } from './directives/parts-menu/parts-menu.component';
import { PartsHideIfUnauthorizedDirective } from './directives/parts-hide-if-unauthorized/parts-hide-if-unauthorized.directive';
import { PartsDisableIfUnauthorizedDirective } from './directives/parts-disable-if-unauthorized/parts-disable-if-unauthorized.directive';
import { PartsDialogComponent } from './directives/parts-dialog/parts-dialog.component';
import { ValidationModule } from './validation/validation.module';
import { PartsErrorMessageComponent } from './directives/parts-error-message/parts-error-message.component';
import { PartsInputComponent } from './directives/parts-input/parts-input.component';
import { DateToStringPipe } from './pipes/date-to-string.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        ButtonModule,
        DialogModule,
        CalendarModule,
        DataTableModule,
        ListboxModule,
        MultiSelectModule,
        MegaMenuModule,
        TieredMenuModule,
        PanelMenuModule,
        MenuModule,
        PanelModule,
        TooltipModule,
        InputMaskModule,
        OrderListModule,
        PickListModule,
        DropdownModule,
        ValidationModule
    ],
    declarations: [
        BaseComponent,
        PartsAccordionComponent,
        PartsAlertComponent,
        PartsCalendarComponent,
        PartsConfirmDialogComponent,
        PartsDataTableComponent,
        PartsFieldComponent,
        PartsListComponent,
        PartsMenuComponent,
        PartsDialogComponent,
        PartsHideIfUnauthorizedDirective,
        PartsDisableIfUnauthorizedDirective,
        PartsErrorMessageComponent,
        PartsInputComponent,
        DateToStringPipe
    ],
    providers: [
        GlobalEventsService,
        AuthService,
        AuthGuardService,
        CanDeactivateGuardService,
        PartsFormBuilderService,
        PartsErrorHandlerService,
        AuthorizationService,
        AuthorizationDataService,
        UtilitiesService,
        ErrorUtilitiesService,
        PartsLoggingService,
        MetadataDataService,
        MetadataService,
        SystemMessageService,
        SystemMessageDataService,
        { provide: ErrorHandler, useClass: PartsErrorHandlerService }
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        PartsAccordionComponent,
        PartsAlertComponent,
        PartsCalendarComponent,
        PartsConfirmDialogComponent,
        PartsDataTableComponent,
        PartsFieldComponent,
        PartsListComponent,
        PartsMenuComponent,
        PartsDialogComponent,
        PartsErrorMessageComponent,
        PartsInputComponent,
        PartsHideIfUnauthorizedDirective,
        PartsDisableIfUnauthorizedDirective,
        DateToStringPipe
    ]
})
export class FrameworkModule {
}
