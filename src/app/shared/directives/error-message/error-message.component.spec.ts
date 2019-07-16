import { ErrorMessageComponent } from './error-message.component';
import { TestInjector } from '../../../demo-common/testing/testing-helpers';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  beforeAll(() => {
    TestInjector.setInjector();
  });

  beforeEach(() => {
      component = new ErrorMessageComponent();
  });
  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('can set errorList', () => {
    component.errorList = ['test'];
    expect(component.errorList.length).toBe(1);
  });
});
