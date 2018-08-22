import { Injectable } from '@angular/core';
import { AppInjector } from '../../app-injector.service';
import { TransactionService } from './transaction.service';
import { IEntity } from '../models/transaction.models';
import { DemoCommonDataService } from './demo-common-data.service';

@Injectable()
export class TransactionEntityDataService extends DemoCommonDataService {

    protected transactionService: TransactionService;
    protected get accountUrlPrefix() {
        return `${this.apiServer.rules}accounts/${this.userSessionService.accountCode.toUpperCase()}`;
    }

    constructor() {
        super();

        // Manually retrieve the dependencies from the injector
        // so that constructor has no dependencies that need to be passed in from child
        const injector = AppInjector.getInstance().getInjector();
        this.transactionService = injector.get(TransactionService);
    }

    // This endpoint is used by the following:
    //    - to call with 'getValidators=true'
    //    - endpointWithTransactionId()
    protected constructEndpoint(route: string, additionalRouteParam?: string) {
        let endpoint = `${this.accountUrlPrefix}/${route}`;
        if (additionalRouteParam) {
            endpoint += `/${additionalRouteParam.toUpperCase()}`;
        }
        return endpoint;
    }

    addEnity(body: IEntity): Promise<IEntity> {
        const endpoint = this.endpoint();
        return <Promise<IEntity>>this.post<IEntity>(endpoint, body);
    }

    updateEnity(body: IEntity, parameter?: string): Promise<IEntity> {
        const endpoint = this.endpoint(parameter);
        return this.put<IEntity>(endpoint, body);
    }

    updateEnityArray(body: IEntity[]): Promise<IEntity[]> {
        const endpoint = this.endpoint();
        return this.put<IEntity[]>(endpoint, body);
    }

    endpointWithTransactionId(additionalRouteParam?: string) {
        let endpoint = this.endpoint(additionalRouteParam);

        if (this.transactionService.currentTransactionId()) {
            if (endpoint.indexOf('?') === -1) {
                endpoint += '?';
            } else {
                endpoint += '&';
            }
            endpoint += `transactionId=${this.transactionService.currentTransactionId().toString()}`;
        }

        return endpoint;
    }
}
