import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemoTransactionComponent } from '../shared/components/demo-transaction-component';
import { SearchService } from '../../../demo-common/services/search.service';
import { AccountHeaderService } from '../shared/directives/account-header/account-header.service';
import { IChild1Entity } from '../shared/models/child1-entity.models';
import { Child1DataService } from '../shared/services/child1-data.service';

@Component({
    selector: 'la-child1',
    templateUrl: './child-component1.component.html',
    styleUrls: ['./child-component1.component.scss']
})
export class ChildComponent1Component extends DemoTransactionComponent {

    child1: IChild1Entity;
    formControls = [
        { name: 'accountCode' },
        { name: 'name1' },
        { name: 'name2' },
        { name: 'name3' },
        { name: 'addressLine1' },
        { name: 'addressLine2' },
        { name: 'addressLine3' },
        { name: 'city' },
        { name: 'state' },
        { name: 'zip' },
        { name: 'product' },
        { name: 'accountType' },
        { name: 'accountStatus' },
        { name: 'startDate' },
        { name: 'lastModifiedDate' }
    ];
    protected routeParamName = 'child1';
    private originalChild1: IChild1Entity;

    constructor(protected route: ActivatedRoute,
        private searchService: SearchService,
        private accountHeaderService: AccountHeaderService,
        private child1DataService: Child1DataService) {
        super(route);
    }

    protected get original() {
        return this.originalChild1;
    }

    protected set original(value: IChild1Entity) {
        this.originalChild1 = value;
    }

    protected get postingEntity() {
        return this.child1;
    }

    saveComplete() {
        super.saveComplete();
        this.accountHeaderService.updateAccountName(
            `${this.child1.name1} ${this.child1.name2} ${this.child1.name3}`);
    }

    commitComplete() {
        super.commitComplete();
        // When an account is updated, we need to update the cached copy of the search results
        this.searchService.accountUpdated(this.child1);
    }

    protected set postingEntity(value: IChild1Entity) {
        value.state = value.state.toUpperCase();
        this.child1 = value;
    }

    protected get dataService() {
        return this.child1DataService;
    }
}
