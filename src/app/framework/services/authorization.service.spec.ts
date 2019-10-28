import { TestBed, inject } from '@angular/core/testing';
import { AuthorizationService } from './authorization.service';
import { AuthorizationDataService } from './authorization-data.service';
import { MockAppConfig } from '../../demo-common/testing/testing-helpers';
import { AppConfig } from '../../app.config';

export class MockAuthorizationDataService {
    getPermissions() {
        return Promise.resolve(['VIEW']);
    }
}

describe('AuthorizationService', () => {
    beforeEach(() => {
        AppConfig.settings = MockAppConfig.settings;
        TestBed.configureTestingModule({
            providers: [
                AuthorizationService,
                {
                    provide: AuthorizationDataService,
                    useClass: MockAuthorizationDataService
                }
            ]
        });
    });

    it('should create the service', inject([AuthorizationService], (service: AuthorizationService) => {
        expect(service).toBeTruthy();
    }));

    it('should authorize if has permission', inject([AuthorizationService],
        async (service: AuthorizationService) => {
        await service.initializePermissions();
        expect(service.hasPermission('VIEW')).toBe(true);
    }));

    it('should not authorize if no permission', inject([AuthorizationService],
        async (service: AuthorizationService) => {
        await service.initializePermissions();
        expect(service.hasPermission('UPDATE')).toBe(false);
    }));
});
