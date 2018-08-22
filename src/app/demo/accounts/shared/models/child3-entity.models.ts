import { IPartsListChoice } from '../../../../framework/models/form-controls.models';
import { IEntity } from '../../../../demo-common/models/transaction.models';

export interface IChild3Entity extends IEntity {
    accountCode: string;
    adminYearEndDate: Date;
    adminFrequencyPerYear: number;
    statementYearEndDate: Date;
    statementFrequencyPerYear: number;
    processingFrequencyPerYear: number;
    billingFrequencyPerYear: number;
    timePeriodList: Array<IPartsListChoice>;
}
