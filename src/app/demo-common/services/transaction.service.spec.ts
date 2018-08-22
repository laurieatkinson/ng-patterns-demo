import { TestBed, inject, async } from '@angular/core/testing';
import { ITransactionIdentifier, INewTransaction } from '../models/transaction.models';
import { TransactionService } from './transaction.service';
import { UserSessionService } from './user-session.service';
import { TransactionDataService } from './transaction-data.service';
import { UtilitiesService } from '../../framework/services/utilities.service';

describe('TransactionService', () => {

    let service: TransactionService;

    class MockTransactionDataService {
        getTransactionObject() {
            return Promise.resolve({
                accountCode: 'ABC',
                accountName: 'Test Account',
                transactionId: 123,
                description: 'testing'
            });
        }
        createTransaction(transaction: INewTransaction): Promise<ITransactionIdentifier> {
            return new Promise<ITransactionIdentifier>((resolve) => {
                resolve({
                    id: 12345
                });
            });
        }
        commitTransaction(transactionId: number): Promise<number> {
            return Promise.resolve(transactionId);
        }
        rollbackTransaction(transactionId: number): Promise<number> {
            return Promise.resolve(transactionId);
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TransactionService,
                {
                    provide: TransactionDataService,
                    useClass: MockTransactionDataService
                },
                {
                    provide: UserSessionService,
                    useValue: {
                        transactionIdentifier: <ITransactionIdentifier>null
                    }
                },
                UtilitiesService
            ]
        });
    });

    beforeEach(inject([TransactionService], (s: TransactionService) => {
        service = s;
    }));

    it('should create the service', () => {
        expect(service).toBeTruthy();
    });

    it('can get current transactionId', () => {
        const userSessionService = <UserSessionService>TestBed.get(UserSessionService);
        userSessionService.transactionIdentifier = {
            id: 11111
        };
        expect(service.currentTransactionId()).toBe(11111);
    });

    it('can get transactionId when not in session', async(() => {
        const userSessionService = <UserSessionService>TestBed.get(UserSessionService);
        userSessionService.transactionIdentifier = null;
        service.getTransactionIdentifier().then(transactionIdentifier => {
            expect(transactionIdentifier.id).toBe(12345);
        }).catch((error) => {
            expect(error).toBeNull();
        });
    }));

    it('can get transactionId when already in session', async(() => {
        const userSessionService = <UserSessionService>TestBed.get(UserSessionService);
        userSessionService.transactionIdentifier = {
            id: 11111
        };
        service.getTransactionIdentifier().then(transactionIdentifier => {
            expect(transactionIdentifier.id).toBe(11111);
        });
    }));

    it('can clear transactionId from session', async(() => {
        const userSessionService = <UserSessionService>TestBed.get(UserSessionService);
        userSessionService.transactionIdentifier = {
            id: 11111
        };
        service.clearTransaction();
        service.getTransactionIdentifier().then(transactionIdentifier => {
            expect(transactionIdentifier.id).toBe(12345);
        }).catch((error) => {
            expect(error).toBeNull();
        });
    }));

    it('can commit', async(() => {
        const userSessionService = <UserSessionService>TestBed.get(UserSessionService);
        userSessionService.transactionIdentifier = {
            id: 11111
        };
        service.commitTransaction('test').then((transactionId) => {
            expect(+transactionId).toBe(11111);
        }).catch((error) => {
            expect(error).toBeNull();
        });
    }));

    it('should not commit without a transactionId', async(() => {
        const userSessionService = <UserSessionService>TestBed.get(UserSessionService);
        userSessionService.transactionIdentifier = null;
        service.commitTransaction('test').then((transactionId) => {
            expect('should not work').toBeFalsy();
        }).catch((error) => {
            expect(error).toBeDefined();
        });
    }));

    it('can rollback when nothing saved yet', async(() => {
        const userSessionService = <UserSessionService>TestBed.get(UserSessionService);
        userSessionService.transactionIdentifier = null;
        service.rollbackTransaction().then((transactionId) => {
            expect(transactionId).toBe('');
        }).catch((error) => {
            expect(error).toBeNull();
        });
    }));

    it('can rollback after a save', async(() => {
        const userSessionService = <UserSessionService>TestBed.get(UserSessionService);
        userSessionService.transactionIdentifier = {
            id: 11111
        };
        service.getTransactionIdentifier().then(transactionIdentifier => {
            service.rollbackTransaction().then((transactionId) => {
                expect(+transactionId).toEqual(transactionIdentifier.id);
            }).catch((error) => {
                expect(error).toBeNull();
            });
        }).catch((error) => {
            expect(error).toBeNull();
        });
    }));
});
