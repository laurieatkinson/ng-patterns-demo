import { async } from '@angular/core/testing';
import { PartsErrorMessageComponent } from './parts-error-message.component';
import { TestInjector } from '../../../demo-common/testing/testing-helpers';

describe('PartsErrorMessageComponent', () => {
  let component: PartsErrorMessageComponent;
  beforeAll(() => {
    TestInjector.setInjector();
  });

  beforeEach(() => {
      component = new PartsErrorMessageComponent();
  });
  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('can set errorList', () => {
    component.errorList = ['test'];
    expect(component.errorList.length).toBe(1);
  });
});
