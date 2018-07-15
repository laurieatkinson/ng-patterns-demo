import { IEntity } from '../../../../demo-common/models/postings.models';

export interface IAccount extends IEntity {
    accountCode: string;
    accountName: string;
    accountType: string;
    accountStatus: string;
}
