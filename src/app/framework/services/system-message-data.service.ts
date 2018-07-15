import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable()
export class SystemMessageDataService extends DataService {

    getMessage(id: number): Promise<string> {
        const endpoint = `${this.apiServer.metadata}messages/${id}`;
        return this.get<string>(endpoint);
    }

    getTooltips(module: string, component: string) {
        const endpoint = `${this.apiServer.metadata}tooltips/${module}/${component}`;
        return this.get<Array<{
            messageId: number,
            fieldName: string,
            tooltipText: string}>>(endpoint);
    }
}
