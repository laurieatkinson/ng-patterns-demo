import { TopNavComponent } from './top-nav.component';
import { TestInjector } from '../../testing/testing-helpers';

describe('TopNavComponent', () => {
    let component: TopNavComponent;
    beforeAll(() => {
        TestInjector.setInjector();
    });

    beforeEach(() => {
      component = new TopNavComponent();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
