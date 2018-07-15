import { Injectable } from '@angular/core';
import { AppInjector } from '../../app-injector.service';
import { PostingService } from './posting.service';
import { IEntity } from '../models/postings.models';
import { DemoCommonDataService } from './demo-common-data.service';

@Injectable()
export class PostingEntityDataService extends DemoCommonDataService {

    protected postingService: PostingService;
    protected get accountUrlPrefix() {
        return `${this.apiServer.rules}accounts/${this.userSessionService.accountCode.toUpperCase()}`;
    }

    constructor() {
        super();

        // Manually retrieve the dependencies from the injector
        // so that constructor has no dependencies that need to be passed in from child
        const injector = AppInjector.getInstance().getInjector();
        this.postingService = injector.get(PostingService);
    }

    // This endpoint is used by the following:
    //    - to call with 'getValidationRules=true'
    //    - endpointWithTransactionId()
    protected constructEndpoint(route: string, additionalRouteParam?: string) {
        let endpoint = `${this.accountUrlPrefix}/${route}`;
        if (additionalRouteParam) {
            endpoint += `/${additionalRouteParam.toUpperCase()}`;
        }
        return endpoint;
    }

    addPostingEnity(body: IEntity): Promise<IEntity> {
        const endpoint = this.endpoint();
        return <Promise<IEntity>>this.post<IEntity>(endpoint, body);
    }

    updatePostingEnity(body: IEntity, parameter?: string): Promise<IEntity> {
        const endpoint = this.endpoint(parameter);
        return this.put<IEntity>(endpoint, body);
    }

    updatePostingEnityArray(body: IEntity[]): Promise<IEntity[]> {
        const endpoint = this.endpoint();
        return this.put<IEntity[]>(endpoint, body);
    }

    endpointWithTransactionId(additionalRouteParam?: string) {
        let endpoint = this.endpoint(additionalRouteParam);

        if (this.postingService.currentPostId()) {
            if (endpoint.indexOf('?') === -1) {
                endpoint += '?';
            } else {
                endpoint += '&';
            }
            endpoint += `transactionId=${this.postingService.currentPostId().toString()}`;
        }

        return endpoint;
    }
}
