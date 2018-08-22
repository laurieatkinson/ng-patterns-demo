import { IPartsListChoice } from '../../../../framework/models/form-controls.models';
import { IEntity } from '../../../../demo-common/models/transaction.models';

export interface IChild2Entity extends IEntity {
    accountType: string;
    contactName: string;
    contactPhoneAreaCode: string;
    contactPhoneNumber: string;
    name1: string;
    name2: string;
    name3: string;
    rate: number;
    accountTypeList: Array<IPartsListChoice>;
}
