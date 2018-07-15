import { async } from '@angular/core/testing';
import { PartsDialogComponent } from './parts-dialog.component';
import { TestInjector } from '../../../demo-common/testing/testing-helpers';

describe('PartsDialogComponent', () => {
  let component: PartsDialogComponent;
  beforeAll(() => {
    TestInjector.setInjector();
  });

  beforeEach(() => {
      component = new PartsDialogComponent();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
