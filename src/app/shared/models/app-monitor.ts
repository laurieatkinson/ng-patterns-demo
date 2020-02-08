import { SeverityLevel } from '../../framework/logging/severity-level.model';

export interface IAppMonitor {
    trackEvent(event: {name: string}, customProperties?: {
        [key: string]: any;
    }): void;
    trackPageView(pageView: {
        name?: string;
        uri?: string;
        refUri?: string;
        pageType?: string;
        isLoggedIn?: boolean;
        properties?: {
            duration?: number;
            [key: string]: any;
        }
    }): void;
    trackPageViewPerformance(pageViewPerformance: {
        name?: string;
        uri?: string;
        perfTotal?: string;
        duration?: string;
        networkConnect?: string;
        sentRequest?: string;
        receivedResponse?: string;
        domProcessing?: string;
    }): void;
    trackException(exception: { exception: Error, severityLevel?: SeverityLevel | number; }): void;
    trackTrace(trace: {message: string}, customProperties?: {
        [key: string]: any;
    }): void;
    trackMetric(metric: { name: string, average: number }, customProperties?: {
        [key: string]: any;
    }): void;
    startTrackPage(name?: string): void;
    stopTrackPage(name?: string, url?: string, customProperties?: {
        [key: string]: any;
    }, measurements?: {
        [key: string]: number;
    }): void;
    startTrackEvent(name?: string): void;
    stopTrackEvent(name: string, properties?: {
        [key: string]: string;
    }, measurements?: {
        [key: string]: number;
    }): void;
    flush(async?: boolean): void;
}
