import { Injectable } from '@angular/core';
import { INewTransaction, IAccountTransactionObject, ITransactionIdentifier } from '../models/transaction.models';
import { DemoCommonDataService } from './demo-common-data.service';

@Injectable()
export class TransactionDataService extends DemoCommonDataService {

    getTransactionObject() {
        const endpoint = `${this.apiServer.rules}accounts/${this.userSessionService.accountCode.toUpperCase()}/transactionobject`;

        const promise = new Promise<IAccountTransactionObject>((resolve, reject) => {
            this.get<IAccountTransactionObject>(endpoint).then((transactionObject) => {
                resolve(transactionObject);
            }).catch((error) => {
                reject(error);
            });
    });
    return promise;

    }

    createTransaction(transaction: INewTransaction): Promise<ITransactionIdentifier> {
        const endpoint = `${this.apiServer.transaction}transactions`;
        return <Promise<ITransactionIdentifier>>(this.post<ITransactionIdentifier>(endpoint, transaction));
    }

    commitTransaction(transactionId: number, description: string): Promise<string> {
        const endpoint = `${this.apiServer.transaction}transactions/commit`;
        return <Promise<string>>(this.post<ITransactionIdentifier>(endpoint,
            {
                transactionId: transactionId,
                description: description
            }));
    }

    rollbackTransaction(transactionId: number): Promise<string> {
        const endpoint = `${this.apiServer.transaction}transactions/${transactionId}/rollback`;
        return <Promise<string>>(this.post<ITransactionIdentifier>(endpoint, null));
    }
}
