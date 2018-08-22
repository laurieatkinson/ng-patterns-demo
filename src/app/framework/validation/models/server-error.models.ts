export interface IServerError {
    details: Array<{ code: number, message: string, target: string }>;
    code: number;
    message: string;
    target: string;
}

export interface INavigationError {
    message?: string;
    serverError?: IServerError;
    navigatingTo: string;
}
