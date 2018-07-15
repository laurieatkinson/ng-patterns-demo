import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { DemoAccountResolver } from '../shared/services/plan-posting-resolver.service';
import { MetadataService } from '../../../framework/services/metadata.service';
import { Child2DataService } from '../shared/services/child2-data.service';
import { IChild2Entity } from '../shared/models/child2-entity.models';

@Injectable()
export class ChildComponent2Resolver extends DemoAccountResolver implements Resolve<IChild2Entity> {

    constructor(private child2DataService: Child2DataService,
        private metadataService: MetadataService) {
            super();
    }

    resolve(route: ActivatedRouteSnapshot) {
        super.resolve(route);

        const promise = new Promise<IChild2Entity>((resolve, reject) => {
            this.child2DataService.getChild2()
                .then(child2 => {
                    const p1 = this.metadataService.getLookupList('AccountType')
                        .then(list => {
                            child2.AccountTypeList = list;
                        });
                        Promise.all([p1])
                            .then(() => {
                                resolve(child2);
                            }).catch((error) => {
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
