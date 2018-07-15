export interface IAppConfig {
    env: {
        name: string;
    };
    appInsights: {
        instrumentationKey: string;
    };
    logging: {
        console: boolean;
        appInsights: boolean;
        traceEnabled: boolean;
    };
    aad: {
        requireAuth: boolean;
        tenant: string;
        resource: string;
        clientId: string;
    };
    apiServer: {
        metadata: string;
        rules: string;
        transaction: string;
    };
}
