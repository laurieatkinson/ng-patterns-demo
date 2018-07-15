export interface IAccountTransactionObject {
    accountCode: string;
    accountName: string;
    transactionId: number;
    description: string;
}

export interface INewTransaction {
    accountCode: string;
    description: string;
}

export interface ITransactionIdentifier {
    id: number;
}

export interface IEntity {
    transactionIdentifier: ITransactionIdentifier;
}
