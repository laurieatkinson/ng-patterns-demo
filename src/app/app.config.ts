import { Injectable } from '@angular/core';
import { IAppConfig } from './demo-common/models/app-config.model';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppConfig {

    static settings: IAppConfig;

    static testLoad() {
        const jsonFile = `assets/config/config.${environment.name}.json`;
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.overrideMimeType('application/json');
            xhr.open('GET', jsonFile, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        this.settings = JSON.parse(xhr.responseText);
                        resolve();
                    } else {
                        reject(`Could not load file '${jsonFile}': ${xhr.status}`);
                    }
                }
            };
            xhr.send(null);
        });
    }

    constructor(private http: HttpClient) {
    }

    load() {
        const jsonFile = `assets/config/config.${environment.name}.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise()
                .then((response: IAppConfig) => {
                    AppConfig.settings = <IAppConfig>response;
                    resolve();
                }).catch((response: any) => {
                    reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
                });
        });
    }
}
