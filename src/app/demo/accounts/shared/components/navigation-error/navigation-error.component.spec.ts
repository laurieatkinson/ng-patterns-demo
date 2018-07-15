import { async } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { NavigationErrorComponent } from './navigation-error.component';
import { TestInjector } from '../../../../../demo-common/testing/testing-helpers';
import { UserSessionService } from '../../../../../demo-common/services/user-session.service';

class MockActivatedRoute extends ActivatedRoute {
  params = Observable.of({
    code: 'CF0102'
  });
}

describe('NavigationErrorComponent', () => {
  let component: NavigationErrorComponent;

  beforeAll(() => {
    TestInjector.setInjector();
  });
  beforeEach(() => {
    component = new NavigationErrorComponent(
      new MockActivatedRoute());
    component.ngOnInit();
  });

  it('should be created', () => {
    component.componentLoadingComplete.subscribe(() => {
      expect(component).toBeTruthy();
    });
    component.ngOnInit();
  });

  it('empty error message shows empty', async(() => {
    component.componentLoadingComplete.subscribe(() => {
      expect(component.header).toEqual('');
    });
    component.ngOnInit();
  }));

  it('can show error message passed in from the route', async(() => {
    // Cast types to get around the service not being public
    (<UserSessionService>(<any>component).userSessionService).navigationError = {
      message: 'Error',
      navigatingTo: '',
      serverError: null
    };
    component.componentLoadingComplete.subscribe(() => {
      expect(component.errorsFromServer).toEqual(['Error']);
    });
    component.ngOnInit();
  }));

  it('can show error title when URL included in from the route', async(() => {
    // Cast types to get around the service not being public
    (<UserSessionService>(<any>component).userSessionService).navigationError = {
      message: 'Error',
      navigatingTo: '/accounts',
      serverError: null
    };
    component.componentLoadingComplete.subscribe(() => {
      expect(component.header).toContain('/accounts');
    });
    component.ngOnInit();
  }));
});
