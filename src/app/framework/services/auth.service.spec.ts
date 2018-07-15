import { TestBed, inject } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { PartsLoggingService } from '../logging/parts-logging.service';
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
                    provide: PartsLoggingService,
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

    it('should default to unauthenticated', inject([TestAuthService, PartsLoggingService],
        (service: TestAuthService, partsLoggingService: PartsLoggingService) => {
        expect(service.isUserAuthenticated).toBe(false);
    }));

    it('should default username to empty', inject([TestAuthService, PartsLoggingService],
        (service: TestAuthService, partsLoggingService: PartsLoggingService) => {
        expect(service.currentUserName).toEqual('');
    }));

    it('can call login', inject([TestAuthService, PartsLoggingService],
        (service: TestAuthService, partsLoggingService: PartsLoggingService) => {
        spyOn(service, 'logIn');
        service.logIn();
        expect(service.logIn).toHaveBeenCalled();
    }));

    it('can call logout', inject([TestAuthService, PartsLoggingService],
        (service: TestAuthService, partsLoggingService: PartsLoggingService) => {
        spyOn(service, 'logOut');
        service.logOut();
        expect(service.logOut).toHaveBeenCalled();
    }));
});
