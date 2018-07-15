import { IPartsListChoice } from '../../../../framework/models/form-controls.models';
import { IEntity } from '../../../../demo-common/models/postings.models';

export interface IChild2Entity extends IEntity {
    accountCode: string;
    asOfDate: Date;
    outsidePlanName: string;
    outsidePlanType: string;
    outsideContactName: string;
    contactPhoneAreaCode: string;
    contactPhoneNumber: string;
    outsidePlanName1: string;
    outsidePlanName2: string;
    outsidePlanName3: string;
    erOverrideContribRate: number;
    AccountTypeList: Array<IPartsListChoice>;
}
