import { IPartsListChoice } from '../../../../framework/models/form-controls.models';
import { IEntity } from '../../../../demo-common/models/postings.models';

export interface IChild3Entity extends IEntity {
    planYearEndDate: Date;
    valuationFrequencyPerYear: number;
    statementYearEndDate: Date;
    statementFrequencyPerYear: number;
    processingFrequencyPerYear: number;
    billingFrequencyPerYear: number;
    adminYearEndDate: Date;
    planGroup: string;
    timePeriodList: Array<IPartsListChoice>;
}
