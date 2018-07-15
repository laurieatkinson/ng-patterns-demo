import { Injectable } from '@angular/core';
import { MetadataDataService } from './metadata-data.service';
import { IPartsListChoice } from '../models/form-controls.models';

@Injectable()
export class MetadataService {

    private dropdownLists: Array<{ name: string, items: Array<IPartsListChoice> }> = [];

    constructor(private metadataDataService: MetadataDataService) {
    }

    getLookupList(name: string) {
        const promise = new Promise<IPartsListChoice[]>((resolve, reject) => {
            const index = this.dropdownLists.findIndex(item => item.name === name);
            if (index > -1) {
                resolve(this.dropdownLists[index].items);
            } else {
                this.metadataDataService.getLookupList(name)
                    .then(list => {
                        const formattedList = Object.keys(list).map(key => {
                            return { value: key, label: list[key] };
                        });
                        this.dropdownLists.push({ name: name, items: formattedList });
                        resolve(formattedList);
                    }).catch((e) => {
                        reject(e);
                    });
            }
        });
        return promise;
    }
}
