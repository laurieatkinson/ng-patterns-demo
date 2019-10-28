import { async } from '@angular/core/testing';
import { TestInjector } from '../../demo-common/testing/testing-helpers';
import { LogOutComponent } from './log-out.component';
import { AuthService } from '../../framework/services/auth.service';

describe('LogOutComponent', () => {
  let component: LogOutComponent;
  beforeAll(() => {
    TestInjector.setInjector();
  });

  beforeEach(() => {
    component = new LogOutComponent(
      TestInjector.getService(AuthService),
      null);
  });

  it('should be created', async(() => {
      expect(component).toBeTruthy();
  }));

  it('should log out upon creation', () => {
    spyOn(component, 'logout');
    component.ngOnInit();
    expect(component.logout).toHaveBeenCalled();
  });
});
