import { TestBed, inject } from '@angular/core/testing';
import { ITransactionIdentifier, INewTransaction } from '../models/postings.models';
import { PostingService } from './posting.service';
import { UserSessionService } from './user-session.service';
import { TransactionDataService } from './transaction-data.service';
import { UtilitiesService } from '../../framework/services/utilities.service';

describe('PostingService', () => {

    let service: PostingService;

    class MockTransactionDataService {
        getPostingObject() {
            return Promise.resolve({
                accountCode: 'ABC',
                accountName: 'Test Account',
                planPostId: 123,
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
        commitPosting(postId: number): Promise<number> {
            return Promise.resolve(postId);
        }
        rollbackPosting(postId: number): Promise<number> {
            return Promise.resolve(postId);
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PostingService,
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

    beforeEach(inject([PostingService], (s: PostingService) => {
        service = s;
    }));

    it('should create the service', () => {
        expect(service).toBeTruthy();
    });

    it('can get current post id', () => {
        const userSessionService = <UserSessionService>TestBed.get(UserSessionService);
        userSessionService.transactionIdentifier = {
            id: 11111
        };
        expect(service.currentPostId()).toBe(11111);
    });

    it('can get postingId when not in session', () => {
        const userSessionService = <UserSessionService>TestBed.get(UserSessionService);
        userSessionService.transactionIdentifier = null;
        service.getPostingIdentifier().then(postingIdentifier => {
            expect(postingIdentifier.id).toBe(12345);
        }).catch((error) => {
            expect(error).toBeNull();
        });
    });

    it('can get postingId when already in session', () => {
        const userSessionService = <UserSessionService>TestBed.get(UserSessionService);
        userSessionService.transactionIdentifier = {
            id: 11111
        };
        service.getPostingIdentifier().then(postingIdentifier => {
            expect(postingIdentifier.id).toBe(11111);
        });
    });

    it('can clear postingId from session', () => {
        const userSessionService = <UserSessionService>TestBed.get(UserSessionService);
        userSessionService.transactionIdentifier = {
            id: 11111
        };
        service.clearPosting();
        service.getPostingIdentifier().then(postingIdentifier => {
            expect(postingIdentifier.id).toBe(12345);
        }).catch((error) => {
            expect(error).toBeNull();
        });
    });

    it('can commit posting', () => {
        const userSessionService = <UserSessionService>TestBed.get(UserSessionService);
        userSessionService.transactionIdentifier = {
            id: 11111
        };
        service.commitPosting('test').then((postId) => {
            expect(+postId).toBe(11111);
        }).catch((error) => {
            expect(error).toBeNull();
        });
    });

    it('should not commit posting without a postid', () => {
        const userSessionService = <UserSessionService>TestBed.get(UserSessionService);
        userSessionService.transactionIdentifier = null;
        service.commitPosting('test').then((postId) => {
            expect('should not work').toBeFalsy();
        }).catch((error) => {
            expect(error).toBeDefined();
        });
    });

    it('can rollback posting when nothing saved yet', () => {
        const userSessionService = <UserSessionService>TestBed.get(UserSessionService);
        userSessionService.transactionIdentifier = null;
        service.rollbackPosting().then((postId) => {
            expect(postId).toBe('');
        }).catch((error) => {
            expect(error).toBeNull();
        });
    });

    it('can rollback posting after a save', () => {
        const userSessionService = <UserSessionService>TestBed.get(UserSessionService);
        userSessionService.transactionIdentifier = {
            id: 11111
        };
        service.getPostingIdentifier().then(postingIdentifier => {
            service.rollbackPosting().then((postId) => {
                expect(+postId).toEqual(postingIdentifier.id);
            }).catch((error) => {
                expect(error).toBeNull();
            });
        }).catch((error) => {
            expect(error).toBeNull();
        });
    });
});
