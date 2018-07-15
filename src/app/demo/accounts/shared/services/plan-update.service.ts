import { Injectable } from '@angular/core';
import { IEntity } from '../../../../demo-common/models/postings.models';
import { PostingService } from '../../../../demo-common/services/posting.service';
import { PostingEntityDataService } from '../../../../demo-common/services/posting-entity-data.service';

@Injectable()
export class PlanUpdateService {

    constructor(private postingService: PostingService) {
    }

    add<T>(dataService: PostingEntityDataService, postingEntity: IEntity) {
        return this.updatePostingEntity<T>(
            dataService.addPostingEnity.bind(dataService), postingEntity);
    }

    update<T>(dataService: PostingEntityDataService, postingEntity: IEntity, parameter?: string) {
        return this.updatePostingEntity<T>(
            dataService.updatePostingEnity.bind(dataService), postingEntity, parameter);
    }

    updateArray<T>(dataService: PostingEntityDataService, entities: Array<IEntity>) {
        return this.updatePostingEntities<T>(
            dataService.updatePostingEnityArray.bind(dataService), entities);
    }

    private updatePostingEntity<T>(updateMethod: (T, string?) => Promise<T>, entity: IEntity, parameter?: string) {
        const discardNewPostingIfUpdateFails = !this.postingService.currentPostId();
        const promise = new Promise<T>((resolve, reject) => {
            // In case this is the first update in the session, must get the postingId
            this.postingService.getPostingIdentifier()
                .then((postingIdentifier) => {
                    // Populate the postingId into the update request
                    entity.transactionIdentifier = postingIdentifier;
                    updateMethod(entity, parameter)
                        .then((updatedEntity) => {
                            resolve(updatedEntity); // API will return an updated version of the entity
                        })
                        .catch((errors) => {
                            if (discardNewPostingIfUpdateFails) {
                                this.postingService.rollbackPosting().then(() => {
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

    private updatePostingEntities<T>(updateMethod: (T) => Promise<T>, entities: Array<IEntity>) {
        const discardNewPostingIfUpdateFails = !this.postingService.currentPostId();
        const promise = new Promise<T>((resolve, reject) => {
            // In case this is the first update in the session, must get the postingId
            this.postingService.getPostingIdentifier()
                .then((postingIdentifier) => {
                    // Populate the postingId into the update request
                    entities = entities.map((item: IEntity) => {
                        item.transactionIdentifier = postingIdentifier;
                        return item;
                    });
                    updateMethod(entities)
                        .then((updatedEntity) => {
                            resolve(updatedEntity); // API will return an updated version of the entity
                        })
                        .catch((errors) => {
                            if (discardNewPostingIfUpdateFails) {
                                entities.forEach((item: IEntity) => {
                                    item.transactionIdentifier = null;
                                });
                                this.postingService.clearPosting();
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
