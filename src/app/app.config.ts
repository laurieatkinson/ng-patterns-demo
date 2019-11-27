import { Injectable } from '@angular/core';
import { IAppConfig } from './demo-common/models/app-config.model';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppConfig {

    static settings: IAppConfig;

    constructor(private http: HttpClient) {
    }

    load() {
        const cacheBusterParam = (new Date()).getTime();
        const jsonFile = `assets/config/config.${environment.name}.json?nocache=${cacheBusterParam}`;
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
