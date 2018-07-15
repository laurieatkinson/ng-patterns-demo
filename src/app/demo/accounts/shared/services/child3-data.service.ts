import { Injectable } from '@angular/core';
import { PostingEntityDataService } from '../../../../demo-common/services/posting-entity-data.service';
import { IChild3Entity } from '../models/child3-entity.models';

@Injectable()
export class Child3DataService extends PostingEntityDataService {

    getChild3(): Promise<IChild3Entity> {
        const endpoint = this.endpointWithTransactionId();
        return this.get<IChild3Entity>(endpoint);
    }

    endpoint() {
        return this.constructEndpoint('class3');
    }
}
