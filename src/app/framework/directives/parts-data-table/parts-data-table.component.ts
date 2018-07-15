import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { SortMeta } from 'primeng/components/common/api';
import { DataTable, DataTableModule } from 'primeng/components/datatable/datatable';
import { IPartsDataTableColumn, IPartsDataTableRowExpansionField } from './parts-data-table-models';

@Component({
    selector: 'la-data-table',
    templateUrl: './parts-data-table.component.html',
    styleUrls: ['./parts-data-table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PartsDataTableComponent implements OnInit {
    private _data: Array<any>;
    protected subscription: any;

    @Input() dataKey: string;
    @Input() title: string;
    @Input() globalFilterPlaceholder = 'Filter results';
    @Input() columns: Array<IPartsDataTableColumn>;
    @Input() details: Array<IPartsDataTableRowExpansionField>;
    @Input() reorderColumns = false;
    @Input() globalFilter = false;
    @Input() sortField = '';
    @Input() editable = false;
    @Input() canDelete = false;
    @Input() allowDeletionOfLastRow = false;
    @Input() selectedItem: any;
    @Input() saveMethod: (any) => Promise<any>; // method to call when save is clicked
    @Input() rows = 10; // The pagination will show bizarre behaviour if this is not numeric.
    @Input() paginator = true;
    @Input() hideType = false;
    @Input() validateRowAtParent = false;
    @Input() showSaveCancelButtons = true;
    @Input() scrollable = false;
    @Input() scrollHeight = '';
    @Input() virtualScroll = false;
    @Input() resizableColumns = false;
    @Input() allowEditingOfAllRows = false;

    displayColumns: Array<IPartsDataTableColumn> = [];
    multiSortFields: SortMeta[] = [];
    sortMode = '';
    sortModeOriginal = '';
    originalData: Array<any> = [];
    errorMessage: string;

    @Output() itemSelected: EventEmitter<any> = new EventEmitter();
    @Output() itemCancelClick: EventEmitter<any> = new EventEmitter();
    @Output() itemSaveCompleted: EventEmitter<any> = new EventEmitter();
    @Output() itemDeleted: EventEmitter<any> = new EventEmitter();
    @Output() validateChangedRow: EventEmitter<any> = new EventEmitter();

    @ViewChild('dataTable') dataTable: DataTable;

    get data(): Array<any> {
        return this._data;
    }

    @Input()
    set data(item: Array<any>) {
        if (this.sortMode === 'multiple') {
            this._data = this.sortdata(item);
        } else {
            this._data = item;
        }
        // temporarily change any null values for choice fields to 'undefined'
        // to fix the problem with filtering to show Undefined showing All
        if (this._data) {
            this._data.forEach(row => {
                this.columns.forEach(column => {
                    if (column.dataType === 'choice') {
                        if (row[column.name] === null) {
                            row[column.name] = 'undefined';
                        }
                    }
                });
            });
        }
    }

    reset() {
        if (this.dataTable) {
            this.dataTable.reset();
        }
    }

    sortdata(items: Array<any>): Array<any> {

        if (this.sortMode === 'multiple' && items) {
            return items.sort((a, b) => {
                let comp = 0;
                this.multiSortFields.some((sortField: SortMeta) => {
                    if (sortField.order === -1) {
                        if (b[sortField.field] > a[sortField.field]) {
                            comp = 1;
                            return true;
                        } else if (b[sortField.field] < a[sortField.field]) {
                            comp = -1;
                            return true;
                        }
                    } else {
                        if (b[sortField.field] < a[sortField.field]) {
                            comp = 1;
                            return true;
                        } else if (b[sortField.field] > a[sortField.field]) {
                            comp = -1;
                            return true;
                        }
                    }
                });
                return comp;
            });
        }
    }

    ngOnInit() {
        if (this.columns) {
            this.columns.forEach(col => {
                if (!col.hidden) {
                    this.displayColumns.push(col);
                }
                if (col.includeEmptyChoice && col.dataType === 'choice') {
                    const emptyChoiceLabel = col.emptyChoiceLabel ? col.emptyChoiceLabel : 'Undefined';
                    col.options.splice(0, 0, { label: emptyChoiceLabel, value: 'undefined' });
                }
                if (col.options && !col.filterOptions) {
                    col.filterOptions = this.columnChoicesPlusAll(col.options);
                }
            });
            const orderedMultiSortColumns = this.columns.filter(col => {
                return col.multisortOrder; // must be a number greater than 0
            }).sort((col1, col2) => {
                if (col1.multisortOrder > col2.multisortOrder) {
                    return 1;
                }
                if (col1.multisortOrder < col2.multisortOrder) {
                    return -1;
                }
                return 0;
            });

            orderedMultiSortColumns.forEach(col => {
                this.multiSortFields.push({ field: col.name, order: col.sortDesc ? -1 : 1 });
                this.sortMode = 'multiple';
                this.data = this.data.slice();
            });
        }
        if (this.editable) {
            this.originalData = this.data.map(item => Object.assign({}, item));
        }

        this.sortModeOriginal = this.sortMode;
    }

    cellModified(e: any) {
        this.errorMessage = '';
        e.data.modified = true;
    }

    getOptionsColumnLabel(item: any, column: IPartsDataTableColumn) {
        if (column.options) {
            const columnValue = item[column.name];
            const col = column.options.find(option => {
                return option.value === columnValue;
            });
            if (col) {
                return col.label;
            }
        }
        return null;
    }

    showFooter(column: IPartsDataTableColumn, columnIndex: number) {
        // If showTotal property is set on this column, add up the values of all rows
        if (column.showTotal) {
            let total = 0;
            if (this._data) {
                this._data.forEach(item => {
                    const value = item[column.name];
                    if (!isNaN(value)) {
                        total += Number(item[column.name]);
                    }
                });
            }
            return total;
        } else if (this.displayColumns.length > columnIndex + 1 && this.displayColumns[columnIndex + 1].showTotal) {
            // If the column to the right of this one is a totals column, then provide Totals: label
            return 'Total:';
        }
        return '';
    }

    onRowClick(event: any) {
        if (event.data.disabled) {
            return;
        }
        if (this.selectedItem !== event.data) {
            this.selectedItem = event.data;
            this.itemSelected.emit(this.selectedItem);
        }
    }

    formatUrl(item: Object, url: string) {
        let result = '';
        if (url) {
            if (url.length === 1) {
                return url;
            }
            // Support links that start with preceding slash or not
            if (url.indexOf('/') === 0) {
                url = url.substring(1);
            }
            // link can contain replaceable tokens indicated by a colon
            // for example: 'accounts/:code/:asOfDate'
            // Replace with data in a column matching the name of the token
            const pathParts = url.split('/');
            pathParts.forEach(part => {
                if (part.indexOf(':') === -1) {
                    result += '/' + part;
                } else if (part.length > 1 && item.hasOwnProperty(part.substring(1))) {
                    const itemProperty = item[part.substring(1)];
                    // if (itemProperty && typeof itemProperty === 'string') {
                    //     itemProperty = itemProperty.toLowerCase();
                    // }
                    result += '/' + itemProperty;
                }
            });
        }
        return result;
    }

    itemChanged(item: any, fieldName: string, doNotSort = true) {
        this.errorMessage = '';
        item.modified = true;

        // If the type of this column is number,
        // then convert the value from string to number
        if (fieldName) {
            const field = this.columns.find((col) => {
                return col.name === fieldName;
            });
            if (field && field.dataType === 'number') {
                item[fieldName] = +item[fieldName];
            }
        }
        if (doNotSort) {
            this.sortMode = '';
        }
        if (this.data && !this.allowEditingOfAllRows) {
            this.data = this.data.map((item1: any) => {
                if (item1 !== this.selectedItem) {
                    item1.disabled = true;
                }
                return item1;
            }).slice();
        }
        this.validateChangedRow.emit(item);
    }

    fieldChanged(item: any, fieldName: string, value: any) {
        item.modified = true;
        item[fieldName] = value;
    }

    saveItem(item: any) {
        this.errorMessage = '';
        const promise = new Promise<null>((resolve, reject) => {
            if (!this.saveMethod) {
                this.errorMessage = 'Save Method not defined for this table.';
                return resolve();
            } else {
                // If this item has any choice items that were temporarily set to undefined,
                // then change back to null before saving
                this.columns.forEach(column => {
                    if (column.dataType === 'choice') {
                        if (item[column.name] === 'undefined') {
                            item[column.name] = null;
                        }
                    }
                });
                this.saveMethod(item).then((updatedItem) => {
                    if (updatedItem) {
                        item = updatedItem;
                    }
                    item.modified = false;
                    const itemIndex = this.originalData.findIndex(originalItem => {
                        return originalItem[this.dataKey] === item[this.dataKey];
                    });

                    this.sortMode = this.sortModeOriginal;

                    this.originalData[itemIndex] = Object.assign({}, item);
                    this.data = this.data.map((item1: any) => {
                        item1.disabled = false; return item1;
                    }).slice();
                    this.itemSaveCompleted.emit(item);
                    return resolve();
                }).catch(error => {
                    this.errorMessage = error;
                    return resolve();
                });
            }
        });
        return promise;
    }

    cancelItemChanges(item: any) {
        this.errorMessage = '';
        item.modified = false;
        const itemIndex = this.data.findIndex(updatedItem => {
            return updatedItem[this.dataKey] === item[this.dataKey];
        });
        const original = this.originalData.find(originalItem => {
            return originalItem[this.dataKey] === item[this.dataKey];
        });
        this.data[itemIndex] = Object.assign({}, original);
        this.sortMode = this.sortModeOriginal;
        this.itemCancelClick.emit();
        this.data = this.data.map((item1: any) => {
            item1.disabled = false; return item1;
        }).slice();
    }

    deleteItem(index: number) {
        const deletedItem = this.data.splice(index, 1);
        this.data = this.data.slice();
        this.itemDeleted.emit(index);
    }

    private columnChoicesPlusAll(list: Array<{ label: string, value: any }>) {
        const filterList = list.slice();
        filterList.unshift({ label: 'All', value: null });
        return filterList;
    }
}
