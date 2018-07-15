import { FormGroup } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { IServerError } from '../validation/models/server-error.models';
import { UtilitiesService } from '../services/utilities.service';
import { PartsLoggingService } from '../logging/parts-logging.service';
import { ErrorUtilitiesService } from '../errorhandling/error-utilities.service';
import { SeverityLevel } from '../logging/severity-level.model';
import { AppInjector } from '../../app-injector.service';
import { GlobalEventsService } from '../services/global-events.service';

@Component({
    template: ''
})
export class BaseComponent implements OnInit, OnDestroy {

    private componentLoadingCompleteSource = new Subject<void>();
    componentLoadingComplete = this.componentLoadingCompleteSource.asObservable();

    protected eventSubscriptions: Array<Subscription> = [];
    protected utilitiesService: UtilitiesService;
    protected partsLoggingService: PartsLoggingService;
    protected globalEventsService: GlobalEventsService;
    protected errorUtilitiesService: ErrorUtilitiesService;

    constructor() {
        // Manually retrieve the dependencies from the injector
        // so that constructor has no dependencies that need to be passed in from child
        const injector = AppInjector.getInstance().getInjector();
        this.utilitiesService = injector.get(UtilitiesService);
        this.partsLoggingService = injector.get(PartsLoggingService);
        this.errorUtilitiesService = injector.get(ErrorUtilitiesService);
        this.globalEventsService = injector.get(GlobalEventsService);
        this.logNavigation();
    }

    ngOnInit() {
        this.componentLoaded();
    }

    // This method is available for child components that do not call ngOnInit()
    // This allows unit test to know when to proceed
    protected setOnInitComplete() {
        this.componentLoadingCompleteSource.next();
    }

    protected componentLoaded() {
        this.globalEventsService.completeRouting();
    }

    private logNavigation() {
        this.partsLoggingService.logPageView();
    }

    // These methods are called in the child classes
    protected getFormattedDate(date: string | Date) {
        return this.utilitiesService.getFormattedDate(date);
    }

    protected logError(errorMessage: string) {
        this.partsLoggingService.logException(new Error(errorMessage),
            null, null, null, SeverityLevel.Error);
    }

    protected populateErrors(error: IServerError, form?: FormGroup) {
        let errorsFromServer: Array<string> = [];
        const fieldErrors = this.errorUtilitiesService.parseFieldErrors(error);
        const modelErrors = this.errorUtilitiesService.parseModelErrors(error);
        let showFieldErrorsAsModelErrors = true;
        const hadFieldErrors = fieldErrors.length > 0;
        if (form) {
            fieldErrors.forEach(fieldError => {
                const control = form.get(fieldError.fieldName);
                if (control) {
                    control.setErrors({ serverValidationError: fieldError.errorMessage });
                } else {
                    modelErrors.push(fieldError.errorMessage);
                }
            });
        } else if (fieldErrors.length > 0) {
            showFieldErrorsAsModelErrors = false;
            fieldErrors.forEach(fieldError => {
                errorsFromServer.push(fieldError.errorMessage);
            });
        }

        if (modelErrors.length > 0) {
            if (!hadFieldErrors || showFieldErrorsAsModelErrors) {
                errorsFromServer = modelErrors;
            } else {
                if (!errorsFromServer.find(errorAdded => {
                    return errorAdded === error.message;
                })) {
                    errorsFromServer.unshift(error.message);
                }
            }
        }
        return errorsFromServer;
    }

    ngOnDestroy() {
        this.eventSubscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}
