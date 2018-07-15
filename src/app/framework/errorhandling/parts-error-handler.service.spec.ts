import { FormBuilder, FormGroup } from '@angular/forms';
import { TestBed, inject } from '@angular/core/testing';
import { MockLoggingService } from '../../demo-common/testing/testing-helpers';
import { PartsLoggingService } from '../logging/parts-logging.service';
import { PartsErrorHandlerService } from './parts-error-handler.service';

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
                    provide: PartsLoggingService,
                    useClass: MockLoggingService
                },
                PartsErrorHandlerService
            ]
        });
    });

    it('should create the service', inject([PartsErrorHandlerService], (service: PartsErrorHandlerService) => {
        expect(service).toBeTruthy();
    }));

    it('should log exception when handling an error',
        inject([PartsErrorHandlerService, PartsLoggingService],
        (service: PartsErrorHandlerService, partsLoggingService: PartsLoggingService) => {
        spyOn(partsLoggingService, 'logException');
        service.handleError(error);
        expect(partsLoggingService.logException).toHaveBeenCalled();
    }));

    it('should log exception when handling an error with embedded error',
        inject([PartsErrorHandlerService, PartsLoggingService],
        (service: PartsErrorHandlerService, partsLoggingService: PartsLoggingService) => {
        spyOn(partsLoggingService, 'logException');
        service.handleError(error2);
        expect(partsLoggingService.logException).toHaveBeenCalledTimes(2);
    }));
});
