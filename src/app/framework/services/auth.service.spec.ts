import { TestBed, inject } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { LoggingService } from '../logging/logging.service';
import { MockLoggingService } from '../../demo-common/testing/testing-helpers';
import { AdalService } from 'adal-angular4';

class TestAuthService extends AuthService {
    authenticate() {}
    getAccessToken() {
        return Promise.resolve('');
    }
}

describe('AuthService', () => {
    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                AdalService,
                TestAuthService,
                {
                    provide: LoggingService,
                    useClass: MockLoggingService
                }
            ]
        });
    });

    it('should create the service', inject([TestAuthService], (service: AuthService) => {
        expect(service).toBeTruthy();
    }));

    it('should default to unauthenticated', inject([TestAuthService, LoggingService],
        (service: TestAuthService, loggingService: LoggingService) => {
        expect(service.isUserAuthenticated).toBe(false);
    }));

    it('should default username to empty', inject([TestAuthService, LoggingService],
        (service: TestAuthService, loggingService: LoggingService) => {
        expect(service.userName).toEqual('');
    }));

    it('can call login', inject([TestAuthService, LoggingService],
        (service: TestAuthService, loggingService: LoggingService) => {
        spyOn(service, 'login');
        service.login();
        expect(service.login).toHaveBeenCalled();
    }));

    it('can call logout', inject([TestAuthService, LoggingService],
        (service: TestAuthService, loggingService: LoggingService) => {
        spyOn(service, 'logout');
        service.logout();
        expect(service.logout).toHaveBeenCalled();
    }));
});
