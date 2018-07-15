import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MetadataService } from '../../../framework/services/metadata.service';
import { DemoAccountResolver } from '../shared/services/plan-posting-resolver.service';
import { GlobalEventsService } from '../../../framework/services/global-events.service';
import { Child1DataService } from '../shared/services/child1-data.service';
import { IChild1Entity } from '../shared/models/child1-entity.models';

@Injectable()
export class ChildComponent1Resolver extends DemoAccountResolver implements Resolve<IChild1Entity> {

    constructor(private child1DataService: Child1DataService,
        private metadataService: MetadataService,
        protected globalEventsService: GlobalEventsService) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot) {
        super.resolve(route);
        const promise = new Promise<IChild1Entity>((resolve, reject) => {
            this.child1DataService.getChild1()
                .then(child1 => {
                    const p1 = this.metadataService.getLookupList('StatusCodes')
                        .then(list => child1.statusCodeList = list);
                    const p2 = this.metadataService.getLookupList('ProductCodes')
                        .then(list => child1.productCodeList = list);
                    const p3 = this.metadataService.getLookupList('StateCodes')
                        .then(list => child1.stateCodeList = list);

                    Promise.all([p1, p2, p3])
                        .then(() => {
                            resolve(child1);
                        }).catch(error => {
                            this.routeToNavigationErrorPage(error);
                            resolve(null);
                        });
                })
                .catch((error) => {
                    this.routeToNavigationErrorPage(error);
                    resolve(null);
                });
        });
        return promise;
    }
}
