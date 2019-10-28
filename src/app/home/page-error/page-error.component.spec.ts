import { TestInjector } from '../../demo-common/testing/testing-helpers';
import { ActivatedRoute } from '@angular/router';
import { async } from '@angular/core/testing';
import { PageErrorComponent } from './page-error.component';
import { of } from 'rxjs';

class MockActivatedRoute extends ActivatedRoute {
  queryParams = of({
    errorMessage: 'Test message'
  });
}

describe('PageErrorComponent', () => {
  let component: PageErrorComponent;
  beforeAll(() => {
    TestInjector.setInjector();
});

  beforeEach(() => {
    component = new PageErrorComponent(new MockActivatedRoute());
  });

  it('should be created', async(() => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  }));
});
