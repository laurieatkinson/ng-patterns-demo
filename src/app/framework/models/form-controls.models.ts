import { ActionCode } from './authorization.types';
export interface IPartsFormControl {
    name: string;
    controls?: Array<IPartsFormControl | Array<IPartsFormControl>>;
    defaultValue?: any;
    disableIfNotAuthorized?: ActionCode;
}

export interface IPartsListChoice {
    value: string | number;
    label: string;
}
