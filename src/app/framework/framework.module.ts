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
import { AccordionComponent } from './directives/accordion/accordion.component';
import { AlertComponent } from './directives/alert/alert.component';
import { CalendarComponent } from './directives/calendar/calendar.component';
import { ConfirmDialogComponent } from './directives/confirm-dialog/confirm-dialog.component';
import { DataTableComponent } from './directives/data-table/data-table.component';
import { FormFieldComponent } from './directives/form-field/form-field.component';
import { FormListComponent } from './directives/form-list/form-list.component';
import { MenuComponent } from './directives/menu/menu.component';
import { HideIfUnauthorizedDirective } from './directives/hide-if-unauthorized/hide-if-unauthorized.directive';
import { DisableIfUnauthorizedDirective } from './directives/disable-if-unauthorized/disable-if-unauthorized.directive';
import { DialogComponent } from './directives/dialog/dialog.component';
import { ValidationModule } from './validation/validation.module';
import { ErrorMessageComponent } from './directives/error-message/error-message.component';
import { InputComponent } from './directives/input/input.component';
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
        AccordionComponent,
        AlertComponent,
        CalendarComponent,
        ConfirmDialogComponent,
        DataTableComponent,
        FormFieldComponent,
        FormListComponent,
        MenuComponent,
        DialogComponent,
        ErrorMessageComponent,
        InputComponent,
        HideIfUnauthorizedDirective,
        DisableIfUnauthorizedDirective,
        DateToStringPipe
    ],
    providers: [
        GlobalEventsService,
        AuthService,
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
        ReactiveFormsModule,
        DialogModule,
        AccordionComponent,
        AlertComponent,
        CalendarComponent,
        ConfirmDialogComponent,
        DataTableComponent,
        FormFieldComponent,
        FormListComponent,
        MenuComponent,
        DialogComponent,
        ErrorMessageComponent,
        InputComponent,
        HideIfUnauthorizedDirective,
        DisableIfUnauthorizedDirective,
        DateToStringPipe
    ]
})
export class FrameworkModule {
}
