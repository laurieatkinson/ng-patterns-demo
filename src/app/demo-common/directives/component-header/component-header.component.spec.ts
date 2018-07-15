import { async } from '@angular/core/testing';
import { ComponentHeaderComponent } from './component-header.component';
import { TestInjector } from '../../testing/testing-helpers';
import { UserSessionService } from '../../services/user-session.service';

describe('ComponentHeaderComponent', () => {
  let component: ComponentHeaderComponent;
  beforeAll(() => {
    TestInjector.setInjector();
  });

  beforeEach(() => {
    component = new ComponentHeaderComponent(
      TestInjector.getService(UserSessionService));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
