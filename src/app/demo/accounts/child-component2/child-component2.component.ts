import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IChild2Entity } from '../shared/models/child2-entity.models';
import { Child2DataService } from '../shared/services/child2-data.service';
import { IPartsFormControl } from '../../../framework/models/form-controls.models';
import { DemoTransactionComponent } from '../shared/components/demo-transaction-component';

@Component({
  selector: 'la-child-component2',
  templateUrl: './child-component2.component.html',
  styleUrls: ['./child-component2.component.scss']
})
export class ChildComponent2Component extends DemoTransactionComponent {

    child2: IChild2Entity;
    originalChild2: IChild2Entity;
    protected routeParamName = 'child2';
    formControls: Array<IPartsFormControl> = [
        { name: 'name1' },
        { name: 'name2' },
        { name: 'name3' },
        { name: 'contactName' },
        { name: 'contactPhoneNumber' },
        { name: 'contactPhoneAreaCode' },
        { name: 'accountType' },
        { name: 'rate' }
    ];

    constructor(protected route: ActivatedRoute,
              private child2DataService: Child2DataService) {
        super(route);
    }

    protected get original() {
        return this.originalChild2;
    }

    protected set original(value: IChild2Entity) {
        this.originalChild2 = value;
    }

    protected get entity() {
        return this.child2;
    }

    protected set entity(value: IChild2Entity) {
        this.child2 = value;
    }

    protected get dataService() {
        return this.child2DataService;
    }
}
