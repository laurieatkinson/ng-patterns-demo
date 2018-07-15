import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { TransactionDataService } from './transaction-data.service';
import { UserSessionService } from './user-session.service';
import { UtilitiesService } from '../../framework/services/utilities.service';
import { ITransactionIdentifier, IAccountTransactionObject } from '../models/postings.models';
import { IServerError } from '../../framework/validation/models/server-error.models';

@Injectable()
export class PostingService {

    private postingCommittedSource = new Subject<string>();
    postingCommitted = this.postingCommittedSource.asObservable();
    private postingRolledbackSource = new Subject<string>();
    postingRolledback = this.postingRolledbackSource.asObservable();
    private postingObjectUpdatedSource = new Subject<IAccountTransactionObject>();
    postingObjectUpdated = this.postingObjectUpdatedSource.asObservable();

    constructor(private userSessionService: UserSessionService,
                private utilitiesService: UtilitiesService,
                private transactionDataService: TransactionDataService) {
    }

    canCommit() {
        return !!this.currentPostId();
    }

    commitPosting(description: string) {
        const promise = new Promise<string>((resolve, reject) => {
            if (!this.currentPostId()) {
                reject('Cannot commit a transaction that has not been created.');
            } else {
                this.transactionDataService.commitPosting(this.currentPostId(), description)
                    .then((postId) => {
                        this.clearPosting();
                        this.userSessionService.postingObject = null;
                        this.getPostingObject().then(() => {
                            resolve(postId);
                            this.postingCommittedSource.next(postId);
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

    rollbackPosting() {
        const promise = new Promise<string>((resolve, reject) => {
            if (!this.currentPostId()) {
                // If nothing has been saved yet, then there is no post id, so skip rolling back
                resolve('');
            } else {
                this.transactionDataService.rollbackPosting(this.currentPostId())
                    .then((postId) => {
                        this.clearPosting();
                        resolve(postId);
                        this.postingRolledbackSource.next(postId);
                    })
                    .catch((reason) => {
                        reject(reason);
                    });
            }
        });
        return promise;
    }

    updateProcessingDates(beginDate: Date, endDate: Date,
                          fundsPricedAsOfDate?: Date, planPostId?: number) {
        const oldPostinObject = UtilitiesService.cloneDeep(this.userSessionService.postingObject);
        this.userSessionService.postingObject = null;
        return this.getPostingObject().catch(() => {
            this.userSessionService.postingObject = oldPostinObject;
        });
    }

    currentPostingNotCommitted() {
        return this.currentPostId() != null;
    }

    currentPostId() {
        // Return a PostId already in session, but do not try to get a new one
        if (this.userSessionService.transactionIdentifier) {
            return this.userSessionService.transactionIdentifier.id;
        }
        return null;
    }

    clearPosting() {
        this.userSessionService.transactionIdentifier = null;
    }

    getPostingObject() {
        const promise = new Promise<IAccountTransactionObject>((resolve, reject) => {
            const postObject = this.userSessionService.postingObject;
            if (!postObject) {
                this.transactionDataService.getPostingObject()
                .then(postingObject => {
                    this.userSessionService.postingObject = postingObject;
                    this.postingObjectUpdatedSource.next(this.userSessionService.postingObject);
                    resolve(this.userSessionService.postingObject);
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

    getPostingIdentifier() {
        // If PostId is not already in session, then go get a new one
        const promise = new Promise<ITransactionIdentifier>((resolve, reject) => {
            const postIdentifier = this.userSessionService.transactionIdentifier;
            if (!postIdentifier) {
                this.transactionDataService.createPosting({
                    accountCode: this.userSessionService.accountCode ? this.userSessionService.accountCode.toUpperCase() : '',
                    description: 'Demo'
                })
                .then(postingIdentifier => {
                    this.userSessionService.transactionIdentifier = {
                        id: postingIdentifier.id
                    };
                    resolve(this.userSessionService.transactionIdentifier);
                })
                .catch((error: IServerError) => {
                    reject(error);
                });
            } else {
                resolve(postIdentifier);
            }
        });
        return promise;
    }
}
