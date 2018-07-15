import { TestBed, inject } from '@angular/core/testing';
import { UserSessionService } from './user-session.service';
import { UtilitiesService } from '../../framework/services/utilities.service';

describe('UserSessionService', () => {

    let service: UserSessionService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                UserSessionService,
                UtilitiesService
            ]
        });
    });

    beforeEach(inject([UserSessionService], (s: UserSessionService) => {
        service = s;
    }));

    it('should create the service', () => {
        expect(service).toBeTruthy();
    });

    it('can get and set TransactionIdentifier', () => {
        service.transactionIdentifier = {
            id: 12345
        };
        expect(service.transactionIdentifier.id).toBe(12345);
    });

    it('can get and set account code', () => {
        service.accountCode = 'ABC123';
        expect(service.accountCode).toBe('abc123');
    });
});
