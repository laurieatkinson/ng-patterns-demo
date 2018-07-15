import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemoTransactionComponent } from '../shared/components/demo-transaction-component';
import { Child3DataService } from '../shared/services/child3-data.service';
import { IPartsFormControl } from '../../../framework/models/form-controls.models';
import { IChild3Entity } from '../shared/models/child3-entity.models';

@Component({
    selector: 'la-child-component3',
    templateUrl: './child-component3.component.html',
    styleUrls: ['./child-component3.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ChildComponent3Component extends DemoTransactionComponent {

    child3: IChild3Entity;
    private originalChild3: IChild3Entity;
    formControls: Array<IPartsFormControl> = [
        { name: 'planYearEndDate' },
        { name: 'valuationFrequencyPerYear' },
        { name: 'statementYearEndDate' },
        { name: 'statementFrequencyPerYear' },
        { name: 'processingFrequencyPerYear' },
        { name: 'billingFrequencyPerYear' },
        { name: 'adminYearEndDate' },
        { name: 'planGroup' }
    ];
    protected routeParamName = 'child3';

    constructor(protected route: ActivatedRoute,
        private child3DataService: Child3DataService) {
        super(route);
    }

    protected get original() {
        return this.originalChild3;
    }

    protected set original(value: IChild3Entity) {
        this.originalChild3 = value;
    }

    protected get postingEntity() {
        return this.child3;
    }

    protected set postingEntity(value: IChild3Entity) {
        this.child3 = value;
    }

    protected get dataService() {
        return this.child3DataService;
    }
}
