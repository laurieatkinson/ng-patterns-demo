export interface IPartsDataTableColumn {
    name: string;
    header?: string;
    showTotal?: boolean;
    sortable?: boolean;
    editable?: boolean;
    filter?: boolean;
    mask?: string;
    numberFormat?: string;
    dataType?: 'string' | 'number' | 'boolean' | 'date' | 'choice' | 'url' | 'mask';
    options?: Array<{ label: string, value: any }>;
    filterOptions?: Array<{ label: string, value: any }>;
    link?: string;
    linkText?: string;
    width?: string;
    hidden?: boolean;
    multisortOrder?: number;
    sortDesc?: boolean;
    includeEmptyChoice?: boolean;
    emptyChoiceLabel?: string;
    excludeFromGlobalFilter?: boolean;
}

export interface IPartsDataTableRowExpansionField {
    label: string;
    fieldName: string;
    dataType?: 'string' | 'number' | 'boolean' | 'date' | 'choice' ;
    options?: Array<{ label: string, value: any }>;
    editable?: boolean;
}
