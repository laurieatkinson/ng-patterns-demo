import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable()
export class SystemMessageDataService extends DataService {

    getMessage(id: number): Promise<string> {
        const endpoint = `${this.apiServer.metadata}messages/${id}`;
        return this.get<string>(endpoint);
    }
}
