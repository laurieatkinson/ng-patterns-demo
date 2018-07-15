import { async } from '@angular/core/testing';
import { TestInjector } from '../../demo-common/testing/testing-helpers';
import { PageNotFoundComponent } from './page-not-found.component';

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  beforeAll(() => {
    TestInjector.setInjector();
  });

  beforeEach(() => {
    component = new PageNotFoundComponent();
  });

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
});
