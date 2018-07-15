import { Injectable } from '@angular/core';
import { PostingEntityDataService } from '../../../../demo-common/services/posting-entity-data.service';
import { IChild2Entity } from '../models/child2-entity.models';

@Injectable()
export class Child2DataService extends PostingEntityDataService {

    getChild2(): Promise<IChild2Entity> {
        const endpoint = this.endpointWithTransactionId();
        return this.get<IChild2Entity>(endpoint);
    }

    endpoint() {
        return this.constructEndpoint('class2');
    }
}
