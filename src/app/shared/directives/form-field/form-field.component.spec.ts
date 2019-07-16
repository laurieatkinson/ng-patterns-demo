import { CommonModule } from '@angular/common';
import { async } from '@angular/core/testing';
import { TestInjector, MockElementRef, MockNgControl } from '../../../demo-common/testing/testing-helpers';
import { FormFieldComponent } from './form-field.component';
import { AppInjector } from '../../../app-injector.service';
import { NgControl } from '@angular/forms';

describe('FormFieldComponent', () => {
    let component: FormFieldComponent;
    beforeAll(() => {
        TestInjector.setInjector([
            { provide: NgControl, useClass: MockNgControl }
        ]);
    });

    beforeEach(() => {
        component = new FormFieldComponent(
            AppInjector.getInstance().getInjector(), new MockElementRef());
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('can initialize text component', () => {
        component.ngOnInit();
        expect(component.type).toBe('text');
    });

    it('can initialize date component', () => {
        component.type = 'date';
        component.ngOnInit();
        component.writeValue(new Date('1990-04-22T00:00:00'));
        expect(component.date).toEqual(new Date('1990-04-22T00:00:00'));
    });

    it('can initialize MM/DD component', () => {
        component.type = 'date';
        component.dateFormat = 'MM/DD';
        component.ngOnInit();
        component.writeValue(new Date('1990-04-22T00:00:00'));
        expect(component.selectedMonth).toEqual(4);
        expect(component.selectedDay).toEqual(22);
    });

    it('can get days in month for MM/DD component', () => {
        component.type = 'date';
        component.dateFormat = 'MM/DD';
        component.ngOnInit();
        component.writeValue(new Date('1990-03-01T00:00:00'));
        expect(component.days.length).toEqual(31);
    });

    it('can get 28 days in month for Feb for any year', () => {
        component.type = 'date';
        component.dateFormat = 'MM/DD';
        component.ngOnInit();
        component.writeValue(new Date('2020-02-01T00:00:00')); // Has 29 days
        expect(component.days.length).toEqual(28);
    });

    it('can update checkbox', () => {
        component.type = 'checkbox';
        component.ngOnInit();
        component.writeValue(false);
        component.updateField(true);
        expect(component.fieldValue).toEqual(true);
    });

    it('can update number in textbox', () => {
        component.type = 'number';
        component.ngOnInit();
        component.writeValue(0);
        component.updateField('100');
        expect(component.fieldValue).toEqual(100);
    });

    it('cannot set to non-numeric in number type field', () => {
        component.type = 'number';
        component.ngOnInit();
        component.writeValue(100);
        component.updateField('pandas');
        expect(component.fieldValue).toEqual(100);
    });

    it('will set empty to 0 for numeric field', () => {
        component.type = 'number';
        component.ngOnInit();
        component.writeValue(100);
        component.updateField('');
        expect(component.fieldValue).toEqual(0);
    });

    it('will set empty to null for nullable numeric field', () => {
        component.type = 'number?';
        component.ngOnInit();
        component.writeValue(100);
        component.updateField('');
        expect(component.fieldValue).toEqual(null);
    });

    it('will set invalid date to 1/1/1900', () => {
        component.type = 'date';
        component.ngOnInit();
        component.writeValue(new Date('1990-04-22T00:00:00'));
        component.updateField('squirrel');
        expect(component.fieldValue).toEqual(new Date('1900-01-01T00:00:00'));
    });

    it('will set invalid nullable date to null', () => {
        component.type = 'date?';
        component.ngOnInit();
        component.writeValue(new Date('1990-04-22T00:00:00'));
        component.updateField('squirrel');
        expect(component.fieldValue).toEqual(null);
    });

    it('will set empty nullable date to null', () => {
        component.type = 'date?';
        component.ngOnInit();
        component.writeValue(new Date('1990-04-22T00:00:00'));
        component.updateField('');
        expect(component.fieldValue).toEqual(null);
    });
});
