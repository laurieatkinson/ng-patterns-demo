import { Router } from '@angular/router';
import { AuthService } from '../../../framework/services/auth.service';
import { HeaderBarComponent } from './header-bar.component';
import { TestInjector } from '../../testing/testing-helpers';
import { MenuComponent } from '../../../shared/directives/menu/menu.component';

describe('HeaderBarComponent', () => {
    let component: HeaderBarComponent;
    beforeAll(() => {
        TestInjector.setInjector();
    });

    beforeEach(() => {
      component = new HeaderBarComponent(
          TestInjector.getService(AuthService),
          TestInjector.getService(Router));
      component.userMenu = new MenuComponent(null);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
