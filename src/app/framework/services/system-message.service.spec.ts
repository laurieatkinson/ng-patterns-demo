import { TestBed, inject } from '@angular/core/testing';
import { SystemMessageDataService } from './system-message-data.service';
import { SystemMessageService } from './system-message.service';

const testErrorMessage = 'Test error message';
const testErrorMessage2 = '{0} error {1}';

class MockSystemMessageDataService {
    getMessage(id: number, errorParameters?: Array<string>): Promise<string> {
        return new Promise<string>((resolve) => {
            if (id === 2) {
                resolve(testErrorMessage2);
            } else {
                resolve(testErrorMessage);
            }
        });
    }
}

describe('SystemMessageService', () => {
    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                SystemMessageService,
                {
                    provide: SystemMessageDataService,
                    useClass: MockSystemMessageDataService
                }
            ]
        });
    });

    it('should create the service',
        inject([SystemMessageService], async(service: SystemMessageService) => {
        expect(service).toBeTruthy();
    }));
});
