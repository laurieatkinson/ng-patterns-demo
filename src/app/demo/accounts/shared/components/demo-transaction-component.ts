import { FormBuilder, FormGroup, ValidatorFn, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ICanComponentDeactivate } from '../../../../framework/services/can-deactivate-guard.service';
import { PostingConfirmDialogComponent } from '../../../../demo-common/directives/posting-confirm-dialog/posting-confirm-dialog.component';
import { PostingEntityDataService } from '../../../../demo-common/services/posting-entity-data.service';
import { UtilitiesService } from '../../../../framework/services/utilities.service';
import { PostingService } from '../../../../demo-common/services/posting.service';
import { PartsFormBuilderService } from '../../../../framework/services/parts-form-builder.service';
import { BaseComponent } from '../../../../framework/components/base-component';
import { ConfirmChoice } from '../../../../framework/models/confirm-choices.enum';
import { UserSessionService } from '../../../../demo-common/services/user-session.service';
import { PartsValidationService } from '../../../../framework/validation/services/parts-validation.service';
import { PlanUpdateService } from '../services/plan-update.service';
import { AccountHeaderComponent } from '../directives/account-header/account-header.component';
import { IEntity } from '../../../../demo-common/models/postings.models';
import { IPartsFormControl } from '../../../../framework/models/form-controls.models';
import { IServerError } from '../../../../framework/validation/models/server-error.models';
import { AppInjector } from '../../../../app-injector.service';
import { ActionCode } from '../../../../framework/models/authorization.types';
import { AuthorizationService } from '../../../../framework/services/authorization.service';
import { ICurrentControlValidators } from '../../../../framework/validation/models/validation.models';

@Component({
    template: ''
})
export class DemoTransactionComponent extends BaseComponent implements OnInit, OnDestroy {
    errorsFromServer: Array<string> = [];
    editMode = false;
    form: FormGroup;
    updatePermission: ActionCode = 'UPDATE';
    protected routeParamName: string;
    protected additionalRouteParamName: string;
    protected formControls: IPartsFormControl | Array<IPartsFormControl>;
    protected postingEntity: IEntity;
    protected original: IEntity;
    protected formBuilder: FormBuilder;
    protected router: Router;
    protected allowSaveOnExit = true;
    protected saveWarningMessage = 'Data has changed.\n\n';
    protected dataService: PostingEntityDataService;
    protected postingService: PostingService;
    protected partsFormBuilderService: PartsFormBuilderService;
    protected partsValidationService: PartsValidationService;
    protected userSessionService: UserSessionService;
    protected planUpdateService: PlanUpdateService;
    protected authorizationService: AuthorizationService;
    private confirmedSubscription: Subscription;
    private updatingForm = false;
    private initializingEntity = false;
    private currentValidators: Array<ICurrentControlValidators> = [];

    @ViewChild('postingConfirmationDialog') confirmationDialog: PostingConfirmDialogComponent;
    @ViewChild(AccountHeaderComponent) private accountHeaderComponent: AccountHeaderComponent;

    constructor(protected route: ActivatedRoute) {
        super();

        const injector = AppInjector.getInstance().getInjector();
        this.router = injector.get(Router);
        this.postingService = injector.get(PostingService);
        this.formBuilder = injector.get(FormBuilder);
        this.partsFormBuilderService = injector.get(PartsFormBuilderService);
        this.partsValidationService = injector.get(PartsValidationService);
        this.userSessionService = injector.get(UserSessionService);
        this.planUpdateService = injector.get(PlanUpdateService);
        this.authorizationService = injector.get(AuthorizationService);
    }

    ngOnInit() {
        super.ngOnInit();

        this.subscribeToPostingCommitted();

        if (this.routeParamName && this.route) {
            this.eventSubscriptions.push(this.route.data
                .subscribe(data => {
                    if (!this.initializingEntity) {
                        this.editMode = false;
                        this.setFormPropertiesFromRouteData(data[this.routeParamName]);

                        // If there is no form created yet, build it
                        if (!this.form) {
                            this.initializingEntity = true;
                            this.buildAndPopulateForm().then(() => {
                                this.initializingEntity = false;
                                this.setOnInitComplete();
                            });
                        } else {
                            // If the form already exists, update it
                            this.patchValue(this.postingEntity, this.form, { onlySelf: true });
                            this.original = UtilitiesService.cloneDeep(this.postingEntity);
                            this.componentLoaded();
                            this.setOnInitComplete();
                        }
                    }
                }));
        } else {
            this.setOnInitComplete();
        }
    }

    protected get formGroupToValidate() {
        return '';
    }

    get linkToPlan() {
        return `/accounts/${this.userSessionService.accountCode}`;
    }

    getFormGroup(formGroupName: string) {
        return this.findFormGroup(formGroupName, this.form.controls);
    }

    setFormPropertiesFromRouteData(data: any) {
        this.postingEntity = data;
    }

    subscribeToPostingCommitted() {
        // The posting can be committed from any component, so let the child component
        // update itself by implementing commitComplete()
        if (this.postingService.postingCommitted) {
            this.eventSubscriptions.push(this.postingService.postingCommitted.subscribe(
                (postId) => {
                    this.commitComplete();
                }));
        }
    }

    canDeactivate(component: ICanComponentDeactivate,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
        nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        // If already navigating to an error page, then allow that
        if (nextState.url.toLowerCase().indexOf('navigation-error') !== -1) {
            return true;
        }

        // If navigating to search-results with error, then allow that
        if (nextState.url.toLowerCase().indexOf('searchresults') !== -1 &&
            this.userSessionService.navigationError) {
            return true;
        }

        let commitNeeded = false;
        const hasChanged = this.hasChanged();

        // If navigating to a different plan (or as-of-date), these changes must be committed
        // if a posting has been created due to a previous change
        if (this.navigatingAwayFromParent(nextState) &&
            ((hasChanged && this.allowSaveOnExit) || this.postingService.currentPostingNotCommitted())) {
            commitNeeded = true;
        }

        if (!hasChanged && !commitNeeded) {
            return true;
        }
        return this.showConfirmationDialog(commitNeeded, false).then(choice => {
            return choice !== ConfirmChoice.cancel;
        });
    }

    postChanges() {
        // Attempt to commit changes
        this.showConfirmationDialog(true, true).then((commitAction) => {
            if (commitAction !== ConfirmChoice.cancel) {
                this.router.navigate([this.linkToPlan]);
            }
        });
    }

    showConfirmationDialog(commitNeeded: boolean, commitButtonClicked: boolean) {
        // Do not allow user to leave without saving if the data has changed
        let warningMessage = '';
        let saveNeeded = false;

        const hasChanged = this.hasChanged();

        if (hasChanged) {
            saveNeeded = true;
            warningMessage = this.saveWarningMessage;
            if (!this.allowSaveOnExit) {
                warningMessage += 'Unsaved changes will be lost.\n\n';
            }
        }

        if (commitNeeded && !commitButtonClicked) {
            warningMessage += 'Transaction has not been committed.';
        }

        // Otherwise ask the user with the dialog service whether to save
        // and return its promise which resolves to true or false when the user decides
        return new Promise<ConfirmChoice>((resolve) => {
            if (commitButtonClicked) {
                this.confirmationDialog.title = 'Enter posting information.';
            }
            this.confirmationDialog.message = warningMessage;
            this.confirmationDialog.allowDiscard = true;
            this.confirmationDialog.allowSave = this.allowSaveOnExit && saveNeeded;
            this.confirmationDialog.confirm = commitNeeded;
            this.confirmationDialog.description = '';
            this.confirmationDialog.show();
            this.confirmedSubscription = this.confirmationDialog.confirmed.subscribe((choice: ConfirmChoice) => {
                // Immediately unsubscribe since we resubscribe everytime the dialog is shown again
                this.confirmedSubscription.unsubscribe();
                const description = this.confirmationDialog.description;
                // If YES, then save/commit the session updates first, then navigate away
                if (choice === ConfirmChoice.save) {
                    if (saveNeeded && this.allowSaveOnExit) {
                        this.save().then((potentialError: IServerError) => {
                            // If the save() fails, it will still resolve and not reject
                            // This is required because save() can be called from the component template
                            // and cannot handle a rejected promise

                            if (potentialError) {
                                this.setBackIfNotDeactivated();
                                return resolve(ConfirmChoice.cancel);
                            } else {
                                if (commitNeeded) {
                                    this.postingService.commitPosting(description).then(() => {
                                        this.commitComplete();
                                        return resolve(choice);
                                    }) // Unable to navigate away due an error committing posting
                                        .catch((error: IServerError) => {
                                            if (error.message && error.message.indexOf('synchronization is still in progress') !== -1) {
                                                this.userSessionService.clearAccount();
                                                this.postingService.clearPosting();
                                                this.routeToSearchResultsWithError(error);
                                                return resolve(ConfirmChoice.cancel);
                                            } else {
                                                this.errorsFromServer = this.populateErrors(error, this.getFormGroupToValidate());
                                                this.setBackIfNotDeactivated();
                                                return resolve(ConfirmChoice.cancel);
                                            }
                                        });
                                } else {
                                    return resolve(choice);
                                }
                            }
                        }); // No catch needed because save() always resolves and never rejects
                    } else {
                        if (commitNeeded) {
                            this.postingService.commitPosting(description).then(() => {
                                this.commitComplete();
                                return resolve(choice);
                            })
                            .catch((error) => {
                                this.errorsFromServer = this.populateErrors(error, this.getFormGroupToValidate());
                                this.setBackIfNotDeactivated();
                                return resolve(ConfirmChoice.cancel);
                            });
                        } else {
                            return resolve(choice);
                        }
                    }
                } else if (choice === ConfirmChoice.discard) {
                    // If NO, then navigate away without saving
                    // If necessary, rollback posting
                    if (commitNeeded) {
                        this.postingService.rollbackPosting().then(() => {
                            this.rollbackComplete().then(() => {
                                return resolve(choice);
                            });
                        }) // Unable to navigate away due an error rolling back posting
                            .catch((error) => {
                                this.errorsFromServer = this.populateErrors(error, this.getFormGroupToValidate());
                                this.setBackIfNotDeactivated();
                                return resolve(ConfirmChoice.cancel);
                            });
                    } else {
                        return resolve(choice);
                    }
                } else { // Cancel, just go back to page without navigating
                    this.setBackIfNotDeactivated();
                    return resolve(ConfirmChoice.cancel);
                }
            }, (err) => {
                this.logError(err);
            });
        });
    }

    buildAndPopulateForm() {
        this.form = this.formBuilder.group({});
        const parameter = this.getAdditionalParamFromRoute();

        const promise = new Promise<void>((resolve, reject) => {
            this.partsFormBuilderService.buildModelDrivenForm(
                this.form, this.formControls, this.partsValidationService,
                this.dataService, this.formGroupToValidate, parameter)
                .then((validators: Array<ICurrentControlValidators>) => {
                    // Store a list of all the validators on each control
                    // This is necessary because Angular has no way to get the validators
                    // already applied to a control and we may need to append to this list.
                    this.currentValidators = validators || [];
                    this.eventSubscriptions.push(this.form.valueChanges.subscribe(() => {
                        this.updateForm();
                    }));
                    this.patchPostingEntityIntoForm();
                    this.original = UtilitiesService.cloneDeep(this.postingEntity);
                    this.additionalFormInitialize();
                    this.componentLoaded();
                    resolve();
                })
                .catch((error) => {
                    // no validation
                    this.componentLoaded();
                    resolve();
                });
        });
        return promise;
    }

    clearValidators(fieldName: string) {
        const control = this.form.get(fieldName);
        if (control) {
            control.clearValidators();
            const existingValidatorIndex = this.currentValidators.findIndex(item => {
                return item.control === control;
            });
            if (existingValidatorIndex !== -1) {
                this.currentValidators.splice(existingValidatorIndex, 1);
                control.updateValueAndValidity();
            }
        }
    }

    addClientOnlyValidator(fieldName: string, validators: ValidatorFn[], warnings?: string[]) {
        let formGroup = this.form;

        // If the fieldName has any dots, those separate the formGroup names.
        // The fieldName is the text following the last dot
        if (fieldName.indexOf('.') !== -1) {
            const fieldNameParts = fieldName.split('.');
            fieldName = fieldNameParts[fieldNameParts.length - 1];

            // Loop through the form groups from the top down
            for (let i = 0; i < fieldNameParts.length - 1; i++) {
                const formGroupName = fieldNameParts[i];
                formGroup = <FormGroup>formGroup.controls[formGroupName];
            }
        }
        const updatedControlValidators = this.partsValidationService.applyClientOnlyValidationRule(
            formGroup, fieldName, validators, this.currentValidators, warnings);
        const existingControlValidator = this.currentValidators.find(item => {
            return item.control === updatedControlValidators.control;
        });
        if (existingControlValidator) {
            existingControlValidator.validators = updatedControlValidators.validators;
        } else {
            this.currentValidators.push(updatedControlValidators);
        }
    }

    protected get saveEntity() {
        return this.postingEntity;
    }

    save(alternateDataService?: PostingEntityDataService, alternateEntity?: IEntity) {
        const dataService = alternateDataService ? alternateDataService : this.dataService;
        let saveEntity = alternateEntity ? alternateEntity : this.saveEntity;

        saveEntity = this.removePartsListChoiceDropdowns(saveEntity);
        const promise = new Promise<void | IServerError>((resolve, reject) => {
            this.errorsFromServer = [];
            if (this.isNew()) {
                this.planUpdateService.add<IEntity>(dataService, saveEntity)
                    .then((updatedEntity) => {
                        if (alternateDataService && alternateDataService !== this.dataService) {
                            this.editMode = false;
                        } else {
                            this.saveComplete(updatedEntity);
                        }
                        resolve();
                    })
                    .catch((error: IServerError) => {
                        this.errorsFromServer = this.populateErrors(error, this.getFormGroupToValidate());
                        resolve(error);
                    });
            } else {
                const parameter = this.getAdditionalParamFromRoute();
                this.planUpdateService.update<IEntity>(dataService, saveEntity, parameter)
                    .then((updatedEntity) => {
                        if (alternateDataService && alternateDataService !== this.dataService) {
                            this.editMode = false;
                        } else {
                            this.saveComplete(updatedEntity);
                        }
                        resolve();
                    })
                    .catch((error: IServerError) => {
                        this.errorsFromServer = this.populateErrors(error, this.getFormGroupToValidate());
                        resolve(error);
                    });
            }
        });
        return promise;
    }

    saveComplete(updatedEntity?: IEntity) {
        this.editMode = false;
        this.original = UtilitiesService.cloneDeep(this.postingEntity);
    }

    rollbackComplete() {
        // Optionally implement in children
        // Also, must re-retrieve the plan header data because the user may
        // have changed this data and now it has been rolledback
        return this.accountHeaderComponent.refresh();
    }

    commitComplete() {
        // Optionally implement in children
    }

    get editAllowed() {
        if (!this.authorizationService.hasPermission(this.updatePermission)) {
            return false;
        }
        return true;
    }

    toggleEditMode(newMode: boolean) {
        this.editMode = newMode;
        if (!this.editMode) {
            this.postingEntity = UtilitiesService.cloneDeep(this.original);
            this.patchPostingEntityIntoForm();
            this.errorsFromServer = [];
            Object.keys(this.form.controls).forEach(key => {
                const control = this.form.controls[key];
                if (control.getError('serverValidationError')) {
                    delete control.errors['serverValidationError'];
                }
                control.markAsPristine();
                control.updateValueAndValidity();
            });
        }
    }

    protected isNew() {
        return false;
    }

    protected patchPostingEntityIntoForm() {
        this.copyItemIntoForm(this.form.controls, this.postingEntity);
    }

    protected updateForm() {
        // If changed do to switching to non-edit mode, then toggleEditMode() already updated the form
        if (this.original && this.editMode && !this.updatingForm) {
            const updatedForm = UtilitiesService.cloneDeep(this.form.getRawValue());
            const original = UtilitiesService.cloneDeep(this.original);
            this.postingEntity = Object.assign({}, original, updatedForm);
        }
    }

    protected additionalFormInitialize() {
    }

    protected setBackIfNotDeactivated() {
    }

    // Can override hasChanged() and pass in a list of fields to skip.
    // If nested, then use this format: ['groupName.childName']
    hasChanged(exclude?: Array<string>) {

        if (!this.original || !this.editMode) {
            return false;
        }

        if (Array.isArray(this.original)) {
            // Currently not supporting save of multiple items
            return false;
        }

        // Do not compare prototype functions added to the objects, just the data
        const original = UtilitiesService.omitFunctions(this.original);
        const postingEntity = UtilitiesService.omitFunctions(this.postingEntity);

        if (exclude) {
            exclude.forEach(exclusion => {
                let skipEntityField = postingEntity;
                let skipOriginalField = original;

                // If the exclusion has any dots, those separate the formGroup names.
                // The fieldName is the text following the last dot
                if (exclusion.indexOf('.') !== -1) {
                    const exclusionNameParts = exclusion.split('.');
                    exclusion = exclusionNameParts[exclusionNameParts.length - 1];

                    // Loop through the form groups from the top down
                    for (let i = 0; i < exclusionNameParts.length - 1; i++) {
                        const formGroupName = exclusionNameParts[i];
                        if (skipEntityField.hasOwnProperty(formGroupName)) {
                            skipEntityField = skipEntityField[formGroupName];
                        }
                        if (skipOriginalField.hasOwnProperty(formGroupName)) {
                            skipOriginalField = skipOriginalField[formGroupName];
                        }
                    }
                }

                skipEntityField[exclusion] = null;
                skipOriginalField[exclusion] = null;
            });
        }

        return !UtilitiesService.isEqual(original, postingEntity);
    }

    protected routeToSearchResultsWithError(error?: string | IServerError) {
        this.userSessionService.navigationError = {
            navigatingTo: ''
        };
        if (typeof error === 'string') {
            this.userSessionService.navigationError.message = error;
        } else {
            this.userSessionService.navigationError.serverError = error;
        }

        this.router.navigate(['accounts/searchresults']);
    }

    protected navigatingAwayFromParent(nextState?: RouterStateSnapshot) {
        return nextState && this.accountHeaderComponent &&
            nextState.url.toLowerCase().indexOf(
                `/accounts/${this.accountHeaderComponent.accountCode.toLowerCase()}`)
            === -1;
    }

    private copyItemIntoForm(formControls: { [key: string]: AbstractControl }, postingEntity: IEntity) {
        this.updatingForm = true;
        Object.keys(formControls).forEach(key => {
            const control = formControls[key];
            if (control instanceof FormArray) {
                this.copyEachItemInArrayIntoForm(control, postingEntity[key]);
            } else if (control instanceof FormGroup) {
                this.copyItemIntoForm(control.controls, postingEntity[key]);
            } else if (postingEntity) {
                formControls[key].patchValue(postingEntity[key]);
            }
        });
        this.updatingForm = false;
    }

    private copyEachItemInArrayIntoForm(array: FormArray, postingEntity: any) {
        // Get the first item in the array of form controls.
        // Clear out any existing data in that control and save it off
        if (array.controls.length > 0) {
            const firstItem = UtilitiesService.cloneDeep((<FormGroup>array.controls[0]).controls);
            Object.keys(firstItem).forEach(fieldName => {
                firstItem[fieldName] = null;
            });

            for (let i = array.length - 1; i >= 0; i--) {
                array.removeAt(i);
            }
            for (let i = 0; i < postingEntity.length; i++) {
                const nextItem = this.formBuilder.group(
                    UtilitiesService.cloneDeep(firstItem)
                );
                array.push(nextItem);

                this.patchValue(postingEntity[i], array.at(i));
            }
        } else {
            // If the array was empty, then must construct the form fields using
            // the postingEntity field names
            for (let i = 0; i < postingEntity.length; i++) {
                const nextItem = this.formBuilder.group({});
                Object.keys(postingEntity[i]).forEach(fieldName => {
                    nextItem.addControl(fieldName, new FormControl());
                });
                array.push(nextItem);
                this.patchValue(postingEntity[i], nextItem);
            }
        }
    }

    // Remove any null properties from the entity if that property should be an FormGroup
    // Angular fails in the patchValue() in this case
    protected patchValue(fromDataEntity: IEntity, toFormControl: AbstractControl, options?: Object) {
        const fromEntity = UtilitiesService.cloneDeep(fromDataEntity);
        this.deleteNullObjectsFromEntity(fromEntity, toFormControl);
        toFormControl.patchValue(fromEntity, options);
    }

    protected mapPickListToList(pickList: Array<{ ruleCode: string, label: string }>) {
        const resultList: Array<{ ruleCode?: string, fundCode?: string, longName: string, shortName: string }> = [];
        if (pickList) {
            pickList.forEach(item => {
                resultList.push({ ruleCode: item.ruleCode, longName: '', shortName: '' });
            });
        }
        return resultList;
    }

    protected mapPickListToListWithOrder(pickList: Array<{ ruleCode: string, label: string }>) {
        const resultList: Array<{ ruleCode?: string, fundCode?: string, longName: string, shortName: string, order: number }> = [];
        if (pickList) {
            pickList.forEach((item, index) => {
                resultList.push({ ruleCode: item.ruleCode, longName: '', shortName: '', order: index + 1 });
            });
        }
        return resultList;
    }

    private deleteNullObjectsFromEntity(fromDataEntity: IEntity, toFormControl: AbstractControl) {
        Object.keys(fromDataEntity).forEach(fieldName => {
            if (toFormControl.get(fieldName) instanceof FormGroup) {
                if (Array.isArray(fromDataEntity)) {
                    this.deleteNullObjectsFromEntity(fromDataEntity[fieldName], toFormControl.get(fieldName));
                } else if (fromDataEntity[fieldName] === null) {
                    delete fromDataEntity[fieldName];
                }
            }
        });
    }

    private findFormGroup(formGroupName: string, controls: { [key: string]: AbstractControl }) {
        // Loop through each field in this form group's controls and see if that field is
        // a form group that matches the name passed in.
        // If so, return it, if not, recursively call this method passing in that form group's controls
        let formGroup = null;
        const formGroupNameIsArray = formGroupName.indexOf('[') !== -1;
        Object.keys(controls).forEach(fieldName => {
            if (controls[fieldName] instanceof FormGroup) {
                if (fieldName === formGroupName) {
                    formGroup = controls[fieldName];
                } else if (!formGroup) {
                    formGroup = this.findFormGroup(formGroupName, (<FormGroup>controls[fieldName]).controls);
                    if (formGroup) {
                        return formGroup;
                    }
                }
            } else if (controls[fieldName] instanceof FormArray) {
                if (formGroupName.indexOf(fieldName) === 0) {
                    const openBracket = formGroupName.indexOf('[');
                    const closeBracket = formGroupName.indexOf(']');
                    const index = Number(formGroupName.substring(openBracket + 1, closeBracket));
                    formGroup = (<FormGroup>controls[fieldName]).controls[index];
                }
            }
        });
        return formGroup;
    }

    private getAdditionalParamFromRoute() {
        let parameter: string;
        if (this.additionalRouteParamName && this.route.snapshot && this.route.snapshot.params &&
            this.route.snapshot.params.hasOwnProperty(this.additionalRouteParamName)) {
            parameter = this.route.snapshot.params[this.additionalRouteParamName];
        }
        return parameter;
    }

    private removePartsListChoiceDropdowns(saveEntity: IEntity) {
        const sendEntity = UtilitiesService.cloneDeep(saveEntity);
        Object.keys(sendEntity).forEach(key => {
            const property = sendEntity[key];
            if (Array.isArray(property) && property.length > 0 &&
                Object.keys(property[0]).length >= 2 &&
                'label' in property[0] && 'value' in property[0]) {
                delete sendEntity[key];
            }
        });
        return sendEntity;
    }

    private getFormGroupToValidate() {
        if (this.formGroupToValidate) {
            return <FormGroup>this.getFormGroup(this.formGroupToValidate);
        }
        return this.form;
    }

    ngOnDestroy() {
        if (this.confirmedSubscription) {
            this.confirmedSubscription.unsubscribe();
        }
        super.ngOnDestroy();
    }
}
