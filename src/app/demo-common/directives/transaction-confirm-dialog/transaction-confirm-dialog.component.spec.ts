import { TransactionConfirmDialogComponent } from './transaction-confirm-dialog.component';
import { TestInjector } from '../../testing/testing-helpers';

describe('TransactionConfirmDialogComponent', () => {
    let component: TransactionConfirmDialogComponent;
    beforeAll(() => {
        TestInjector.setInjector();
    });

    beforeEach(() => {
      component = new TransactionConfirmDialogComponent();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
