import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MetadataService } from '../../../framework/services/metadata.service';
import { IChild3Entity } from '../shared/models/child3-entity.models';
import { Child3DataService } from '../shared/services/child3-data.service';
import { DemoAccountResolver } from '../shared/services/demo-account-resolver.service';

@Injectable()
export class ChildComponent3Resolver extends DemoAccountResolver implements Resolve<IChild3Entity> {

    constructor(private child3DataService: Child3DataService,
        private metadataService: MetadataService) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot) {

        super.resolve(route);

        const promise = new Promise<IChild3Entity>((resolve, reject) => {
            return this.child3DataService.getChild3()
                .then(child3 => {
                   return this.metadataService.getLookupList('TimePeriods')
                    .then(list => {
                        child3.timePeriodList = list;
                            resolve(child3);
                        }).catch((error) => {
                            this.routeToNavigationErrorPage(error);
                            resolve(null);
                        });
                }).catch((error) => {
                    this.routeToNavigationErrorPage(error);
                    resolve(null);
                });
        });
        return promise;
    }
}
