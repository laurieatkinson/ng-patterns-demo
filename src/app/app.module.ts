import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppInsights } from 'applicationinsights-js';
import { DemoCommonModule } from './demo-common/demo-common.module';
import { FrameworkModule } from './framework/framework.module';
import { AppRoutingModule } from './app-routing.module';
import { DemoModule } from './demo/demo.module';
import { LowerCaseUrlSerializer } from './framework/services/url-serializer.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './home/page-not-found/page-not-found.component';
import { PageErrorComponent } from './home/page-error/page-error.component';
import { LogOutComponent } from './home/log-out/log-out.component';
import { AppConfig } from './app.config';
import { AuthInterceptorService } from './framework/services/auth-interceptor.service';

export function initializeApp(appConfig: AppConfig) {
    const promise = appConfig.load().then(() => {
        if (AppConfig.settings && AppConfig.settings.logging &&
            AppConfig.settings.logging.appInsights) {
            const config: Microsoft.ApplicationInsights.IConfig = {
                instrumentationKey: AppConfig.settings.appInsights.instrumentationKey
            };
            AppInsights.downloadAndSetup(config);
        }
    });
    return () => promise;
}

@NgModule({
    imports: [
        BrowserModule,
        FrameworkModule,
        BrowserAnimationsModule,
        DemoCommonModule,
        DemoModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        PageNotFoundComponent,
        PageErrorComponent,
        LogOutComponent
    ],
    providers: [
        AppConfig,
        { provide: APP_INITIALIZER,  useFactory: initializeApp, deps: [AppConfig], multi: true },
        { provide: UrlSerializer, useClass: LowerCaseUrlSerializer },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
