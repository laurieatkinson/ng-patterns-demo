import { AuthService } from '../../../framework/services/auth.service';
import { HeaderBarComponent } from './header-bar.component';
import { MenuComponent } from '../../../framework/directives/menu/menu.component';
import { Router } from '@angular/router';
import { TestInjector } from '../../testing/testing-helpers';

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
