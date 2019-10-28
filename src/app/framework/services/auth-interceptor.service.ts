import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler } from '@angular/common/http';
import { AdalService, AdalInterceptor } from 'adal-angular4';
import { AppConfig } from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService extends AdalInterceptor {
    _isUserAuthenticated: boolean;
    _userName: string;

    constructor(adalService: AdalService) {
        super(adalService)
    }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        if (request.url.endsWith('.json') || !AppConfig.settings.aad.requireAuth) {
            return next.handle(request);
        }
        return super.intercept(request, next);
    }
}
