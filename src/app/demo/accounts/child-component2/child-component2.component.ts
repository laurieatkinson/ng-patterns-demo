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
        { name: 'outsidePlanName' },
        { name: 'outsidePlanType' },
        { name: 'outsideContactName' },
        { name: 'contactPhoneNumber' },
        { name: 'contactPhoneAreaCode' },
        { name: 'outsidePlanName1' },
        { name: 'outsidePlanName2' },
        { name: 'outsidePlanName3' },
        { name: 'erOverrideContribRate' }
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

    protected get postingEntity() {
        return this.child2;
    }

    protected set postingEntity(value: IChild2Entity) {
        this.child2 = value;
    }

    protected get dataService() {
        return this.child2DataService;
    }
}
