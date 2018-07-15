import { Injectable } from '@angular/core';
import { INewTransaction, IAccountTransactionObject, ITransactionIdentifier } from '../models/postings.models';
import { DemoCommonDataService } from './demo-common-data.service';

@Injectable()
export class TransactionDataService extends DemoCommonDataService {

    getPostingObject() {
        const endpoint = `${this.apiServer.rules}accounts/${this.userSessionService.accountCode.toUpperCase()}/postingobject`;

        const promise = new Promise<IAccountTransactionObject>((resolve, reject) => {
            this.get<IAccountTransactionObject>(endpoint).then((postingObject) => {
                resolve(postingObject);
            }).catch((error) => {
                reject(error);
            });
    });
    return promise;

    }

    createPosting(posting: INewTransaction): Promise<ITransactionIdentifier> {
        const endpoint = `${this.apiServer.transaction}postings`;
        return <Promise<ITransactionIdentifier>>(this.post<ITransactionIdentifier>(endpoint, posting));
    }

    commitPosting(postId: number, description: string): Promise<string> {
        const endpoint = `${this.apiServer.transaction}postings/commit`;
        return <Promise<string>>(this.post<ITransactionIdentifier>(endpoint,
            {
                postId: postId,
                description: description
            }));
    }

    rollbackPosting(postId: number): Promise<string> {
        const endpoint = `${this.apiServer.transaction}postings/${postId}/rollback`;
        return <Promise<string>>(this.post<ITransactionIdentifier>(endpoint, null));
    }
}
