import { Injectable } from '@angular/core';
import { IEntity } from '../../../../demo-common/models/transaction.models';
import { TransactionService } from '../../../../demo-common/services/transaction.service';
import { TransactionEntityDataService } from '../../../../demo-common/services/transaction-entity-data.service';

@Injectable()
export class UpdateService {

    constructor(private transactionService: TransactionService) {
    }

    add<T>(dataService: TransactionEntityDataService, entity: IEntity) {
        return this.updateEntity<T>(
            dataService.addEnity.bind(dataService), entity);
    }

    update<T>(dataService: TransactionEntityDataService, entity: IEntity, parameter?: string) {
        return this.updateEntity<T>(
            dataService.updateEnity.bind(dataService), entity, parameter);
    }

    updateArray<T>(dataService: TransactionEntityDataService, entities: Array<IEntity>) {
        return this.updateEntities<T>(
            dataService.updateEnityArray.bind(dataService), entities);
    }

    private updateEntity<T>(updateMethod: (T, string?) => Promise<T>, entity: IEntity, parameter?: string) {
        const discardNewTransactionIfUpdateFails = !this.transactionService.currentTransactionId();
        const promise = new Promise<T>((resolve, reject) => {
            // In case this is the first update in the session, must get the transactionId
            this.transactionService.getTransactionIdentifier()
                .then((transactionIdentifier) => {
                    // Populate the transactionId into the update request
                    entity.transactionIdentifier = transactionIdentifier;
                    updateMethod(entity, parameter)
                        .then((updatedEntity) => {
                            resolve(updatedEntity); // API will return an updated version of the entity
                        })
                        .catch((errors) => {
                            if (discardNewTransactionIfUpdateFails) {
                                this.transactionService.rollbackTransaction().then(() => {
                                    reject(errors);
                                })
                                .catch(() => {
                                    reject(errors);
                                })
                            }
                            reject(errors);
                        });
                })
                .catch((error) => {
                    reject(error);
                });
        });
        return (promise);
    }

    private updateEntities<T>(updateMethod: (T) => Promise<T>, entities: Array<IEntity>) {
        const discardNewTransactionIfUpdateFails = !this.transactionService.currentTransactionId();
        const promise = new Promise<T>((resolve, reject) => {
            // In case this is the first update in the session, must get the transactionId
            this.transactionService.getTransactionIdentifier()
                .then((transactionIdentifier) => {
                    // Populate the transactionId into the update request
                    entities = entities.map((item: IEntity) => {
                        item.transactionIdentifier = transactionIdentifier;
                        return item;
                    });
                    updateMethod(entities)
                        .then((updatedEntity) => {
                            resolve(updatedEntity); // API will return an updated version of the entity
                        })
                        .catch((errors) => {
                            if (discardNewTransactionIfUpdateFails) {
                                entities.forEach((item: IEntity) => {
                                    item.transactionIdentifier = null;
                                });
                                this.transactionService.clearTransaction();
                            }
                            reject(errors);
                        });
                })
                .catch((error) => {
                    reject(error);
                });
        });
        return (promise);
    }
}
