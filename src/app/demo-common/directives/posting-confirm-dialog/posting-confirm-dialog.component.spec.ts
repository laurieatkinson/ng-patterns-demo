import { PostingConfirmDialogComponent } from './posting-confirm-dialog.component';
import { TestInjector } from '../../testing/testing-helpers';

describe('PostingConfirmDialogComponent', () => {
    let component: PostingConfirmDialogComponent;
    beforeAll(() => {
        TestInjector.setInjector();
    });

    beforeEach(() => {
      component = new PostingConfirmDialogComponent();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
