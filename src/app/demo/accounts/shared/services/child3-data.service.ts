import { Injectable } from '@angular/core';
import { TransactionEntityDataService } from '../../../../demo-common/services/transaction-entity-data.service';
import { IChild3Entity } from '../models/child3-entity.models';

@Injectable()
export class Child3DataService extends TransactionEntityDataService {

    getChild3(): Promise<IChild3Entity> {
        const endpoint = this.endpointWithTransactionId();
        return this.get<IChild3Entity>(endpoint);
    }

    endpoint() {
        return this.constructEndpoint('class3');
    }
}
