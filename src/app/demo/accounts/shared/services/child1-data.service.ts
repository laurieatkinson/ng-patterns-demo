import { Injectable } from '@angular/core';
import { PostingEntityDataService } from '../../../../demo-common/services/posting-entity-data.service';
import { IChild1Entity } from '../models/child1-entity.models';

@Injectable()
export class Child1DataService extends PostingEntityDataService {

    getChild1(): Promise<IChild1Entity> {
        const endpoint = this.endpointWithTransactionId();
        return this.get<IChild1Entity>(endpoint);
    }

    endpoint() {
        return this.constructEndpoint('class1');
    }
}
