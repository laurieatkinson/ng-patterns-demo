import { Injectable } from '@angular/core';
import { TransactionEntityDataService } from '../../../../demo-common/services/transaction-entity-data.service';
import { IChild1Entity } from '../models/child1-entity.models';

@Injectable()
export class Child1DataService extends TransactionEntityDataService {

    getChild1(): Promise<IChild1Entity> {
        const endpoint = this.endpointWithTransactionId();
        return this.get<IChild1Entity>(endpoint);
    }

    endpoint() {
        return this.constructEndpoint('class1');
    }
}
