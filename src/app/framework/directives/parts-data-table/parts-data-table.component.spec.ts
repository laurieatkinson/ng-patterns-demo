import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { InputMaskModule } from 'primeng/components/inputmask/inputmask';
import { PartsAlertComponent } from '../parts-alert/parts-alert.component';
import { PartsDataTableComponent } from './parts-data-table.component';
import { PartsInputComponent } from '../parts-input/parts-input.component';
import { PartsHideIfUnauthorizedDirective } from '../parts-hide-if-unauthorized/parts-hide-if-unauthorized.directive';
import { IPartsDataTableColumn } from './parts-data-table-models';
import { TestInjector } from '../../../demo-common/testing/testing-helpers';
import { UtilitiesService } from '../../services/utilities.service';

const columns: Array<IPartsDataTableColumn> = [
    { name: 'id', dataType: 'number', hidden: true },
    { name: 'firstName', header: 'First Name', dataType: 'string', sortable: false, editable: true,
      filter: true, multisortOrder: 2 },
    { name: 'lastName', header: 'Last Name', dataType: 'string', sortable: true, editable: true,
      filter: false, multisortOrder: 1 },
    { name: 'accountNumber', header: 'Account Number', width: '15%', dataType: 'string', sortable: true,
      editable: true, filter: false },
    { name: 'age', header: 'Age', dataType: 'number', sortable: false, editable: true, filter: true,
      showTotal: true },
    { name: 'dateOfBirth', header: 'Date of Birth', dataType: 'date', sortable: true, editable: true, filter: false }
];

describe('PartsDataTableComponent', () => {
    let component: PartsDataTableComponent;
    beforeAll(() => {
        TestInjector.setInjector();
    });

    beforeEach(() => {
        component = new PartsDataTableComponent();
        component.columns = UtilitiesService.cloneDeep(columns);
        component.data = [
            { firstName: 'Barney', lastName: 'Rubble', accountNumber: '34567', age: 21 },
            { firstName: 'Betty', lastName: 'Rubble', accountNumber: '45678', age: 20 },
            { firstName: 'Wilma', lastName: 'Flinstone', accountNumber: '23456', age: 30, dateOfBirth: new Date(1999, 2, 2) },
            { firstName: 'Fred', lastName: 'Flinstone', accountNumber: '12345', age: 31, dateOfBirth: new Date(1999, 1, 1) }];
    });

    it('should create', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should get the label for a choice type column', () => {
        const item = {
            status: 1
        };
        const orderItemColumn: IPartsDataTableColumn = {
                name: 'status', dataType: 'choice',
                options: [{ label: 'Active', value: 1 },
                          { label: 'Inactive', value: 0 }]
            };
        const label = component.getOptionsColumnLabel(item, orderItemColumn);
        expect(label).toBe('Active');
    });

    it('should sort if sortMode is multiple', () => {
        component.sortMode = 'multiple';
        component.ngOnInit();
        expect(component.data[0].firstName).toBe('Fred');
    });

    it('should sort descending if sortMode is multiple and order -1', () => {
        component.sortMode = 'multiple';
        component.columns[1].sortDesc = true;
        component.columns[2].sortDesc = true;
        component.ngOnInit();
        expect(component.data[0].firstName).toBe('Betty');
    });

    it('should set item as modified when row edited', () => {
        component.editable = true;
        component.ngOnInit();
        const event = {
            data: { modified: false }
        };
        component.cellModified(event);
        expect(event.data.modified).toBe(true);
    });

    it('should show footer', () => {
        component.ngOnInit();
        const total = component.showFooter(columns[4], 3);
        expect(total).toBe(102);
    });

    it('should select item of row clicked', () => {
        component.ngOnInit();
        const event = {
            data: component.data[0]
        };
        component.onRowClick(event);
        expect(component.selectedItem['firstName']).toBe('Fred');
    });

    it('should validate modified field in row when edited', () => {
        component.editable = true;
        component.ngOnInit();
        component.data[0].firstName = 'Pebbles';
        spyOn(component.validateChangedRow, 'emit');
        component.itemChanged(component.data[0], 'firstName');
        expect(component.validateChangedRow.emit).toHaveBeenCalledWith(component.data[0]);
    });

    it('should disable other rows when a row is edited', () => {
        component.editable = true;
        component.ngOnInit();
        component.data[0].firstName = 'Pebbles';
        component.itemChanged(component.data[0], 'firstName');
        expect(component.data[1].disabled).toBe(true);
    });

    it('can modify one field', () => {
        component.editable = true;
        component.ngOnInit();
        component.fieldChanged(component.data[0], 'firstName', 'Pebbles');
        expect(component.data[0].firstName).toBe('Pebbles');
    });

    it('can save item', async(() => {
        component.editable = true;
        component.ngOnInit();
        component.saveMethod = () => {
            return Promise.resolve();
        };
        spyOn(component.itemSaveCompleted, 'emit');
        component.saveItem(component.data[0]).then(() => {
            expect(component.itemSaveCompleted.emit).toHaveBeenCalledWith(component.data[0]);
        });
    }));

    it('can cancel item changes', async(() => {
        component.editable = true;
        component.ngOnInit();
        component.data[0].firstName = 'Pebbles';
        component.cancelItemChanges(component.data[0]);
        expect(component.data[0].firstName).toBe('Fred');
    }));

    it('can delete item', async(() => {
        component.editable = true;
        component.ngOnInit();
        const numberOfItems = component.data.length;
        component.deleteItem(component.data[0]);
        expect(component.data.length).toBe(numberOfItems - 1);
    }));

    it('should format a url with placeholders', () => {
        const item = {
            code: 'ABC123',
            asOfDate: '07-04-2017'
        };
        const url = '/accounts/:code/:asOfDate';
        const result = component.formatUrl(item, url);
        expect(result).toEqual('/accounts/ABC123/07-04-2017');
    });

    it('should format a url without preceding slash by inserting it', () => {
        const item = {
            code: 'ABC123',
            asOfDate: '07-04-2017'
        };
        const url = 'accounts/:code/:asOfDate';
        const result = component.formatUrl(item, url);
        expect(result).toEqual('/accounts/ABC123/07-04-2017');
    });

    it('should format a url with missing placeholder', () => {
        const item = {
            code: 'ABC123'
        };
        const url = '/accounts/:code/:asOfDate';
        const result = component.formatUrl(item, url);
        expect(result).toEqual('/accounts/ABC123');
    });
});
