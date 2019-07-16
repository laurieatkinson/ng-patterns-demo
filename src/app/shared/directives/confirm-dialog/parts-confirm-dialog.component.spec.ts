import { TestInjector } from '../../../demo-common/testing/testing-helpers';
import { fakeAsync } from '@angular/core/testing';
import { DialogModule, MenuModule, ButtonModule } from 'primeng/primeng';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ConfirmChoice } from '../../models/confirm-choices.enum';

describe('ConfirmDialogComponent', () => {
    let component: ConfirmDialogComponent;
    beforeAll(() => {
        TestInjector.setInjector();
    });

    beforeEach(() => {
        component = new ConfirmDialogComponent();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('show should display', () => {
        expect(component.display).toBeFalsy();
        component.show();
        expect(component.display).toBeTruthy();
    });

    it('cancel should hide', () => {
        component.show();
        component.cancel();
        expect(component.display).toBeFalsy();
    });

    it('save should hide', () => {
        component.show();
        component.save();
        expect(component.display).toBeFalsy();
    });

    it('should emit Save on save', fakeAsync((): void => {
        component.confirmed.subscribe((choice: ConfirmChoice) => {
            expect(choice).toEqual(ConfirmChoice.save);
        });
        component.show();
        component.save();
    }));

    it('should not emit Cancel on save', fakeAsync((): void => {
        component.confirmed.subscribe((choice: ConfirmChoice) => {
            expect(choice === ConfirmChoice.cancel).toBeFalsy();
        });
        component.show();
        component.save();
    }));

    it('should emit Cancel on cancel', fakeAsync((): void => {
        component.confirmed.subscribe((choice: ConfirmChoice) => {
            expect(choice).toEqual(ConfirmChoice.cancel);
        });
        component.show();
        component.cancel();
    }));
});
