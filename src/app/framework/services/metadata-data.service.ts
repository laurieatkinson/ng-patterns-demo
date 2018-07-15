import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { ILookupList, ITimePeriod } from '../models/metadata.models';

// AJAX calls related to metadata
@Injectable()
export class MetadataDataService extends DataService {

    getLookupList(name: string): Promise<Array<ILookupList>> {
        const endpoint = `${this.apiServer.metadata}lookuplists/${name}`;
        return this.get<Array<ILookupList>>(endpoint);
    }
}
