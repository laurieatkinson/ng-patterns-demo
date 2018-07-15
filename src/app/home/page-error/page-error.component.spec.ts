import { TestInjector } from '../../demo-common/testing/testing-helpers';
import { ActivatedRoute } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PageErrorComponent } from './page-error.component';
import { Observable } from 'rxjs/Observable';

class MockActivatedRoute extends ActivatedRoute {
  queryParams = Observable.of({
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
