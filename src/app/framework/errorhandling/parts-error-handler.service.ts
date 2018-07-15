import { ErrorHandler, Injectable } from '@angular/core';
import { PartsLoggingService } from '../logging/parts-logging.service';

@Injectable()
export class PartsErrorHandlerService extends ErrorHandler {

    constructor(private partsLoggingService: PartsLoggingService) {
        super();
    }

    handleError(error: Error) {
        this.partsLoggingService.logException(error); // Manually log exception
        const originalError = this.getOriginalError(error);
        if (originalError !== error) {
            this.partsLoggingService.logException(originalError); // Manually log original exception
        }
    }

    private getOriginalError(error: any) {
        while (error && error.originalError) {
            error = error.originalError;
        }
        return (error);
    }
}
