;
import { TestBed, inject } from '@angular/core/testing';
import { MockLoggingService } from '../../demo-common/testing/testing-helpers';
import { LoggingService } from '../logging/logging.service';
import { ErrorHandlerService } from './error-handler.service';

const error: Error = {
    name: 'Test Error',
    message: 'An error occurred',
    stack: null
};

const error2 = {
    name: 'Test Error',
    message: 'An error occurred',
    stack: null,
    originalError: {
        name: 'Original Error',
        message: 'Parent error occurred',
        stack: null
    }
};

describe('PartsErrorHandlerService', () => {
    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: LoggingService,
                    useClass: MockLoggingService
                },
                ErrorHandlerService
            ]
        });
    });

    it('should create the service', inject([ErrorHandlerService], (service: ErrorHandlerService) => {
        expect(service).toBeTruthy();
    }));

    it('should log exception when handling an error',
        inject([ErrorHandlerService, LoggingService],
        (service: ErrorHandlerService, loggingService: LoggingService) => {
        spyOn(loggingService, 'logException');
        service.handleError(error);
        expect(loggingService.logException).toHaveBeenCalled();
    }));

    it('should log exception when handling an error with embedded error',
        inject([ErrorHandlerService, LoggingService],
        (service: ErrorHandlerService, loggingService: LoggingService) => {
        spyOn(loggingService, 'logException');
        service.handleError(error2);
        expect(loggingService.logException).toHaveBeenCalledTimes(2);
    }));
});
