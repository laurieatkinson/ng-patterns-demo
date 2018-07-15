import { TestBed, inject } from '@angular/core/testing';
import { SystemMessageDataService } from './system-message-data.service';
import { SystemMessageService } from './system-message.service';

const testErrorMessage = 'Test error message';
const testErrorMessage2 = '{0} error {1}';
const tooltips = [{
        messageId: 1,
        fieldName: 'shortName',
        tooltipText: 'Enter Short Name'
    },
    {
        messageId: 2,
        fieldName: 'longName',
        tooltipText: 'Enter Long Name'
    }];

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
    getTooltips(module: string, component: string) {
        return new Promise<Array<{ messageId: number;
                                   fieldName: string;
                                   tooltipText: string;
                                  }>>((resolve) => {
            resolve(tooltips);
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

    it('should create the service', inject([SystemMessageService], (service: SystemMessageService) => {
        expect(service).toBeTruthy();
    }));

    it('should get error message by id', inject([SystemMessageService], (service: SystemMessageService) => {
        service.getMessagesForComponent([1, 2, 3])
            .then(() => {
                const errorMessage = service.getMessage(1);
                expect(errorMessage.length).toBeGreaterThan(0);
            });
    }));

    it('should get error message with parameters', inject([SystemMessageService], (service: SystemMessageService) => {
        service.getMessagesForComponent([1, 2, 3])
            .then(() => {
                const errorMessage = service.getMessage(2, ['Testing', 'messages']);
                expect(errorMessage.indexOf('Testing')).toBeGreaterThan(-1);
            });
    }));

    it('should get a default error message for invalid id', inject([SystemMessageService], (service: SystemMessageService) => {
        service.getMessagesForComponent([1, 2, 3])
            .then(() => {
                const errorMessage = service.getMessage(4);
                expect(errorMessage.indexOf('4')).toBeGreaterThan(-1);
            });
    }));

    it('should get tooltips for component', inject([SystemMessageService], (service: SystemMessageService) => {
        service.getTooltipsForComponent('loans')
            .then(() => {
                const tooltip = service.getTooltip('shortName', 'loans');
                expect(tooltip.length).toBeGreaterThan(0);
            });
    }));
});
