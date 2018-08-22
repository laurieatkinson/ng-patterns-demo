import { TestBed, inject } from '@angular/core/testing';
import { ErrorUtilitiesService } from './error-utilities.service';
import { INavigationError } from '../validation/models/server-error.models';
import { UtilitiesService } from '../services/utilities.service';

const errorResponse = {
    'details': [
        {
            'code': 1,
            'message': '\'Max Term\' must be less than or equal to \'97\'.',
            'target': 'maxTerm'
        },
        {
            'code': 2,
            'message': '\'Min Term\' must be less than or equal to \'12\'.',
            'target': 'minTerm'
        }
    ],
    'code': 7,
    'message': 'Multiple validation errors',
    'target': 'page'
};

const navigationError: INavigationError = {
    message: 'Test',
    navigatingTo: 'account/ABC123/action/AB01',
    serverError: {
        code: 1,
        message: 'An error occurred',
        details: null,
        target: null
    }
};

describe('ErrorUtilitiesService', () => {
    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                UtilitiesService,
                ErrorUtilitiesService
            ]
        });
    });

    it('should create the service', inject([ErrorUtilitiesService], (service: ErrorUtilitiesService) => {
        expect(service).toBeTruthy();
    }));

    it('should parse field errors', inject([ErrorUtilitiesService], (service: ErrorUtilitiesService) => {
        const errorsFromServer = service.parseFieldErrors(errorResponse);
        expect(errorsFromServer.length).toBe(2);
    }));

    it('should find field name in field error', inject([ErrorUtilitiesService], (service: ErrorUtilitiesService) => {
        const errorsFromServer = service.parseFieldErrors(errorResponse);
        expect(errorsFromServer[1].fieldName).toBe('minTerm');
    }));

    it('should parse model errors', inject([ErrorUtilitiesService], (service: ErrorUtilitiesService) => {
        const errorsFromServer = service.parseModelErrors(errorResponse);
        expect(errorsFromServer[0]).toBe('Multiple validation errors');
    }));

    it('should parse simple string type error', inject([ErrorUtilitiesService], (service: ErrorUtilitiesService) => {
        const errorMessage = 'Test';
        const errorsFromServer = service.parseModelErrors(errorMessage);
        expect(errorsFromServer[0]).toBe(errorMessage);
    }));

    it('should parse navigation errors', inject([ErrorUtilitiesService], (service: ErrorUtilitiesService) => {
        const localNavigationError = UtilitiesService.cloneDeep(navigationError);
        localNavigationError.message = 'Test';
        const error = service.parseNavigationError(localNavigationError);
        expect(error).toEqual(['Test']);
    }));

    it('should parse navigation server error message', inject([ErrorUtilitiesService], (service: ErrorUtilitiesService) => {
        const localNavigationError = UtilitiesService.cloneDeep(navigationError);
        localNavigationError.message = '';
        localNavigationError.serverError.message = 'An error occurred';
        const error = service.parseNavigationError(localNavigationError);
        expect(error).toEqual(['An error occurred']);
    }));

    it('should parse navigation server error details', inject([ErrorUtilitiesService], (service: ErrorUtilitiesService) => {
        const localNavigationError = UtilitiesService.cloneDeep(navigationError);
        localNavigationError.message = '';
        localNavigationError.serverError.message = 'An error occurred';
        localNavigationError.serverError.details = [
            {
                message: 'msg1',
                code: null,
                target: null
            },
            {
                message: 'msg2',
                code: null,
                target: null
            }
        ];
        const error = service.parseNavigationError(localNavigationError);
        expect(error).toEqual(['An error occurred', 'msg1', 'msg2']);
    }));
});
