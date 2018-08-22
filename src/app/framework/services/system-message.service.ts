import { Injectable } from '@angular/core';
import { SystemMessageDataService } from './system-message-data.service';

@Injectable()
export class SystemMessageService {
    private messages: Array<{ id: number, message: string }> = [];

    constructor(private systemMessageDataService: SystemMessageDataService) {
    }

    getMessage(id: number, errorParameters?: Array<string>) {
        let message = `Invalid (Error: ${id})`;
        const match = this.messages.find(item => item.id === id);
        if (match) {
            message = match.message;
            if (errorParameters) {
                errorParameters.forEach((param, index) => {
                    const token = `{${index.toString()}}`;
                    message = message.replace(token, param);
                });
            }
        }
        return message;
    }
}
