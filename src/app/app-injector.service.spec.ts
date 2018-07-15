import { AppInjector } from './app-injector.service';
import { inject, TestBed } from '@angular/core/testing';

describe('AppInjector', () => {
    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                AppInjector
            ]
        });
    });

    it('should only create one instance', () => {
        const service1 = AppInjector.getInstance();
        const service2 = AppInjector.getInstance();
        expect(service1).toBe(service2);
    });
});
