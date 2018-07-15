import { TestBed, inject } from '@angular/core/testing';
import { AuthorizationService } from './authorization.service';
import { AuthorizationDataService } from './authorization-data.service';
import { MockAppConfig } from '../../demo-common/testing/testing-helpers';

export class MockAuthorizationDataService {
    getPermissions() {
        return Promise.resolve(['PLANINQ_VIEW_ONLY', 'PLANINQ_UPDATE_FULL']);
    }
}

export class MockAuthAppConfig extends MockAppConfig {
    aad: {
        requireAuth: true;
    };
}

describe('AuthorizationService', () => {
    beforeEach(() => {

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
        (service: AuthorizationService) => {
        service.initializePermissions().then(() => {
            expect(service.hasPermission('PLANINQ_VIEW_ONLY')).toBe(true);
        });
    }));

    it('should not authorize if no permission', inject([AuthorizationService],
        (service: AuthorizationService) => {
        service.initializePermissions().then(() => {
            expect(service.hasPermission('PARTSNEXT_VIEW_ONLY')).toBe(false);
        });
    }));
});
