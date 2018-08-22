import { ComponentHeaderComponent } from './component-header.component';
import { TestInjector } from '../../testing/testing-helpers';

describe('ComponentHeaderComponent', () => {
  let component: ComponentHeaderComponent;
  beforeAll(() => {
    TestInjector.setInjector();
  });

  beforeEach(() => {
    component = new ComponentHeaderComponent();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
