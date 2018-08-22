import { TestBed, inject } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { LoggingService } from '../logging/logging.service';
import { MockLoggingService } from '../../demo-common/testing/testing-helpers';

// class MockAuthenticationContext {
//     constructor(config: adal.Config) { }
//     isCallback(url: string) {
//         return false;
//     }
//     handleWindowCallback() {}
//     getLoginError() {
//         return '';
//     }
//     getCachedUser(resource: string, callback: (message: string, token: string) => any) {}
//     login() {}
//     logOut() {}
// }

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
                TestAuthService,
                {
                    provide: LoggingService,
                    useClass: MockLoggingService
                }
                // {
                //     provide: AuthenticationContext,
                //     useClass: MockAuthenticationContext
                // }
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
        expect(service.currentUserName).toEqual('');
    }));

    it('can call login', inject([TestAuthService, LoggingService],
        (service: TestAuthService, loggingService: LoggingService) => {
        spyOn(service, 'logIn');
        service.logIn();
        expect(service.logIn).toHaveBeenCalled();
    }));

    it('can call logout', inject([TestAuthService, LoggingService],
        (service: TestAuthService, loggingService: LoggingService) => {
        spyOn(service, 'logOut');
        service.logOut();
        expect(service.logOut).toHaveBeenCalled();
    }));
});
