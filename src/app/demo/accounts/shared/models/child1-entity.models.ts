import { IPartsListChoice } from '../../../../framework/models/form-controls.models';
import { IEntity } from '../../../../demo-common/models/transaction.models';

export interface IChild1Entity extends IEntity {
    accountCode: string;
    name1: string;
    name2: string;
    name3: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    city: string;
    zip: string;
    state: string;
    product: string;
    accountType: string;
    accountStatus: string;
    startDate: Date;
    lastModifiedDate: Date;
    statusCodeList: Array<IPartsListChoice>;
    productCodeList: Array<IPartsListChoice>;
    stateCodeList: Array<IPartsListChoice>;
    accountTypeList: Array<IPartsListChoice>;
}
