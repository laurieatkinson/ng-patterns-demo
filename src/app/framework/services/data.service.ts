import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { UtilitiesService } from './utilities.service';
import { LoggingService } from '../logging/logging.service';
import { GlobalEventsService } from './global-events.service';
import { AppConfig } from '../../app.config';
import { AuthService } from './auth.service';

interface IPostOptions {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe: 'response';
}

@Injectable()
export class DataService {

    protected apiServer = AppConfig.settings ? AppConfig.settings.apiServer : null;

    constructor(protected http: HttpClient,
                protected authService: AuthService,
                protected utilitiesService: UtilitiesService,
                protected loggingService: LoggingService,
                protected globalEventsService: GlobalEventsService
            ) {
    }

    protected get<T>(url: string) {
        const promise = new Promise<T>((resolve, reject) => {
            this.globalEventsService.startLoadingData();
            this.http.get(url).toPromise()
                .then((entity: T) => {
                    this.convertDatesFromApi(entity);
                    this.globalEventsService.completeLoadingData();
                    resolve(entity);
                })
                .catch((response: any) => {
                    const error = this.logError({
                        url: url,
                        response: response
                    });
                    this.globalEventsService.completeLoadingData();
                    reject(error);
                });
        });
        return promise;
    }

    protected post<T>(url: string, body: any) {
        const promise = new Promise<T | string>((resolve, reject) => {
            const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            });
            this.globalEventsService.startLoadingData();
            const options: IPostOptions = { headers: headers, observe: 'response' };
            this.http.post(url, body, options).toPromise()
                .then((response: HttpResponse<T>) => {
                    this.globalEventsService.completeLoadingData();
                    const contentType = response.headers.get('Content-Type');
                    const newResourceUrl = response.headers.get('Location');
                    if (contentType && contentType.indexOf('json') > -1) {
                        resolve(<T>response.body);
                    } else if (newResourceUrl) {
                        resolve(newResourceUrl);
                    } else {
                        resolve(null);
                    }
                })
                .catch((response: any) => {
                    const error = this.logError({
                        url: url,
                        body: body,
                        response: response
                    });
                    this.globalEventsService.completeLoadingData();
                    reject(error);
                });
        });
        return promise;
    }

    public put<T>(url: string, body: any) {
        const promise = new Promise<T>((resolve, reject) => {
            const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            });
            this.globalEventsService.startLoadingData();
            const options: IPostOptions = { headers: headers, observe: 'response' };
            this.http.put(url, body, options).toPromise()
                .then((response: HttpResponse<T>) => {
                    this.globalEventsService.completeLoadingData();
                    const contentType = response.headers.get('Content-Type');
                    if (contentType && contentType.indexOf('json') > -1) {
                        resolve(<T>response.body);
                    } else {
                        resolve(null);
                    }
            })
            .catch((response: any) => {
                const error = this.logError({
                    url: url,
                    body: body,
                    response: response
                });
                this.globalEventsService.completeLoadingData();
                reject(error);
            });
        });
        return promise;
    }

    public delete<T>(url: string, body: any) {
        const promise = new Promise<T>((resolve, reject) => {
            const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            });
            this.globalEventsService.startLoadingData();
            const options: IPostOptions = { headers: headers, observe: 'response' };
            this.http.delete(url, options).toPromise()
                .then((response: HttpResponse<T>) => {
                    this.globalEventsService.completeLoadingData();
                    resolve(null);
            })
            .catch((response: any) => {
                const error = this.logError({
                    url: url,
                    body: body,
                    response: response
                });
                this.globalEventsService.completeLoadingData();
                reject(error);
            });
        });
        return promise;
    }

    endpoint(additionalRouteParam?: string) {
        // override in child class
        return '';
    }

    protected isToday(date: Date) {
        return UtilitiesService.isToday(date);
    }

    protected getFormattedDate(date: string | Date) {
        return this.utilitiesService.getFormattedDate(date);
    }

    protected appendDates(url: string, beginDate?: Date, endDate?: Date) {
        if (endDate && UtilitiesService.isDate(endDate)) {
            if (url.indexOf('?') === -1) {
                url += '?';
            } else {
                url += '&';
            }
            url += `endDate=${this.getFormattedDate(endDate)}`;
        }
        if (beginDate && UtilitiesService.isDate(beginDate)) {
            if (url.indexOf('?') === -1) {
                url += '?';
            } else {
                url += '&';
            }
            url += `beginDate=${this.getFormattedDate(beginDate)}`;
        }
        return url;
    }

    protected appendParameter(url: string, parameter: string, parameterValue: any) {
        if (url.indexOf('?') === -1) {
            url += '?';
        } else {
            url += '&';
        }
        url += `${parameter}=${parameterValue}`;
        return url;
    }

    private logError(error: { url: string, body?: any, response: any }) {

        this.loggingService.logError(error.response);

        try {
            if (error.response._body && JSON.parse(error.response._body).error) {
                return JSON.parse(error.response._body).error;
            }
        } catch (e) {}

        if (error.response.status) {
            return `${error.response.status} - ${error.response.statusText}`;
        }
        return 'Error calling API';
    }

    private convertDatesFromApi(input: any) {
        const iso8601RegEx = /(19|20|21)\d\d([-/.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])T(\d\d)([:/.])(\d\d)([:/.])(\d\d)/;

        if (!input || typeof input !== 'object') {
            return;
        }

        Object.keys(input).forEach(key => {
            const value = input[key];
            const type = typeof value;
            let match: any;
            if (type === 'string' && (match = value.match(iso8601RegEx))) {
                input[key] = new Date(value);
            } else if (type === 'string' && value === '0001-01-01T00:00:00') {
                input[key] = null;
            } else if (type === 'object') {
                this.convertDatesFromApi(value);
            }
        });
    }
}
