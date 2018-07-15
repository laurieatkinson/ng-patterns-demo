export interface ITimePeriod {
    period: string;
    frequency: string;
    freqPerYear: number;
    uniqueId: number;
}

export interface ILookupList {
    [K: string]: string;
}
