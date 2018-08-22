import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { TransactionDataService } from './transaction-data.service';
import { UserSessionService } from './user-session.service';
import { ITransactionIdentifier, IAccountTransactionObject } from '../models/transaction.models';
import { IServerError } from '../../framework/validation/models/server-error.models';

@Injectable()
export class TransactionService {

    private transactionCommittedSource = new Subject<string>();
    transactionCommitted = this.transactionCommittedSource.asObservable();
    private transactionRolledbackSource = new Subject<string>();
    transactionRolledback = this.transactionRolledbackSource.asObservable();
    private transactionObjectUpdatedSource = new Subject<IAccountTransactionObject>();
    transactionObjectUpdated = this.transactionObjectUpdatedSource.asObservable();

    constructor(private userSessionService: UserSessionService,
                private transactionDataService: TransactionDataService) {
    }

    canCommit() {
        return !!this.currentTransactionId();
    }

    commitTransaction(description: string) {
        const promise = new Promise<string>((resolve, reject) => {
            if (!this.currentTransactionId()) {
                reject('Cannot commit a transaction that has not been created.');
            } else {
                this.transactionDataService.commitTransaction(this.currentTransactionId(), description)
                    .then((transactionId) => {
                        this.clearTransaction();
                        this.userSessionService.transactionObject = null;
                        this.getTransactionObject().then(() => {
                            resolve(transactionId);
                            this.transactionCommittedSource.next(transactionId);
                        })
                        .catch((reason) => {
                            reject(reason);
                        });
                    })
                    .catch((reason) => {
                        reject(reason);
                    });
            }
        });
        return promise;
    }

    rollbackTransaction() {
        const promise = new Promise<string>((resolve, reject) => {
            if (!this.currentTransactionId()) {
                // If nothing has been saved yet, then there is no transaction id, so skip rolling back
                resolve('');
            } else {
                this.transactionDataService.rollbackTransaction(this.currentTransactionId())
                    .then((transactionId) => {
                        this.clearTransaction();
                        resolve(transactionId);
                        this.transactionRolledbackSource.next(transactionId);
                    })
                    .catch((reason) => {
                        reject(reason);
                    });
            }
        });
        return promise;
    }

    currentTransactionNotCommitted() {
        return this.currentTransactionId() != null;
    }

    currentTransactionId() {
        // Return a transactionId already in session, but do not try to get a new one
        if (this.userSessionService.transactionIdentifier) {
            return this.userSessionService.transactionIdentifier.id;
        }
        return null;
    }

    clearTransaction() {
        this.userSessionService.transactionIdentifier = null;
    }

    getTransactionObject() {
        const promise = new Promise<IAccountTransactionObject>((resolve, reject) => {
            const postObject = this.userSessionService.transactionObject;
            if (!postObject) {
                this.transactionDataService.getTransactionObject()
                .then(transactionObject => {
                    this.userSessionService.transactionObject = transactionObject;
                    this.transactionObjectUpdatedSource.next(this.userSessionService.transactionObject);
                    resolve(this.userSessionService.transactionObject);
                })
                .catch((error: IServerError) => {
                    reject(error);
                });
            } else {
                resolve(postObject);
            }
        });
        return promise;
    }

    getTransactionIdentifier() {
        // If transactionId is not already in session, then go get a new one
        const promise = new Promise<ITransactionIdentifier>((resolve, reject) => {
            const identifier = this.userSessionService.transactionIdentifier;
            if (!identifier) {
                this.transactionDataService.createTransaction({
                    accountCode: this.userSessionService.accountCode ? this.userSessionService.accountCode.toUpperCase() : '',
                    description: 'Demo'
                })
                .then(transactionIdentifier => {
                    this.userSessionService.transactionIdentifier = {
                        id: transactionIdentifier.id
                    };
                    resolve(this.userSessionService.transactionIdentifier);
                })
                .catch((error: IServerError) => {
                    reject(error);
                });
            } else {
                resolve(identifier);
            }
        });
        return promise;
    }
}
