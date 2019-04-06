import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { UtilitiesService } from '../../framework/services/utilities.service';
import { ITransactionIdentifier } from '../models/transaction.models';
import { INavigationError } from '../../framework/validation/models/server-error.models';

@Injectable()
export class UserSessionService {

    private _accountCode: string;
    private _accountType: string;

    private accountCodeChangedSource = new Subject<void>();
    accountCodeChanged = this.accountCodeChangedSource.asObservable();

    transactionIdentifier: ITransactionIdentifier;
    navigationError: INavigationError;

    constructor(private utilitiesService: UtilitiesService) {
        this._accountCode = '';
        this._accountType = '';
        this.transactionIdentifier = null;
    }

    get accountCode() {
        return this._accountCode;
    }

    set accountCode(value: string) {
        value = value ? value.toLowerCase() : '';
        this._accountCode = value;
        this.accountCodeChangedSource.next();
    }

    get accountType() {
        return this._accountType;
    }

    set accountType(value: string) {
        this._accountType = value;
    }

    clearAccount() {
        this.accountType = '';
        this.accountCode = '';
        this.transactionIdentifier = null;
    }
}
