import { Injectable } from '@angular/core';
import { SeverityLevel } from './severity-level.model';
import { AppConfig } from '../../app.config';

// API Documentation
// https://github.com/microsoft/applicationinsights-js
@Injectable()
export class LoggingService {

    // Option if not using dynamic configuration file
    // appInsights: ApplicationInsights;
    // constructor() {
    //     this.appInsights = new ApplicationInsights({
    //         config: {
    //             instrumentationKey: environment.instrumentationKey,
    //             enableAutoRouteTracking: true // option to log all route changes
    //         }
    //     });
    //     this.appInsights.loadAppInsights();
    // }
    logPageView(name?: string, url?: string) {
        if (AppConfig.settings && AppConfig.settings.logging && AppConfig.settings.logging.appInsights) {
            AppConfig.appMonitor.trackPageView({
                name: name,
                uri: url
            });
        }
    }

    // Log non-exception type errors, e.g. invalid API request
    logError(error: any, severityLevel?: SeverityLevel) {
        if (AppConfig.settings && AppConfig.settings.logging && AppConfig.settings.logging.console) {
            this.sendToConsole(error, severityLevel);
        }
    }

    logEvent(name: string, properties?: { [key: string]: any }) {
        if (AppConfig.settings && AppConfig.settings.logging && AppConfig.settings.logging.appInsights) {
            AppConfig.appMonitor.trackEvent({ name: name}, properties);
        }
    }

    logMetric(name: string, average: number, properties?: { [key: string]: any }) {
        if (AppConfig.settings && AppConfig.settings.logging && AppConfig.settings.logging.appInsights) {
            AppConfig.appMonitor.trackMetric({ name: name, average: average }, properties);
        }
    }

    logException(exception: Error, severityLevel?: SeverityLevel) {
        if (AppConfig.settings && AppConfig.settings.logging && AppConfig.settings.logging.console) {
            this.sendToConsole(exception, severityLevel);
        }
        if (AppConfig.settings && AppConfig.settings.logging && AppConfig.settings.logging.appInsights) {
            AppConfig.appMonitor.trackException({ exception: exception, severityLevel: severityLevel });
        }
    }

    logTrace(message: string, properties?: { [key: string]: any }) {
        if (AppConfig.settings && AppConfig.settings.logging && AppConfig.settings.logging.appInsights) {
            AppConfig.appMonitor.trackTrace({ message: message}, properties);
        }
    }

    private sendToConsole(error: any, severityLevel: SeverityLevel = SeverityLevel.Error) {

        switch (severityLevel) {
            case SeverityLevel.Critical:
            case SeverityLevel.Error:
                (<any>console).group('Demo Error:');
                console.error(error);
                if (error.message) {
                    console.error(error.message);
                }
                if (error.stack) {
                    console.error(error.stack);
                }
                (<any>console).groupEnd();
                break;
            case SeverityLevel.Warning:
                (<any>console).group('Demo Error:');
                console.warn(error);
                (<any>console).groupEnd();
                break;
            case SeverityLevel.Information:
                (<any>console).group('Demo Error:');
                console.log(error);
                (<any>console).groupEnd();
                break;
        }
    }
}
