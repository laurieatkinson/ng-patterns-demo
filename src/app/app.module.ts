import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler, APP_INITIALIZER, Injector } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { DemoCommonModule } from './demo-common/demo-common.module';
import { FrameworkModule } from './framework/framework.module';
import { AppRoutingModule } from './app-routing.module';
import { DemoModule } from './demo/demo.module';
import { ValidationModule } from './framework/validation/validation.module';
import { LowerCaseUrlSerializer } from './framework/services/url-serializer.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './home/page-not-found/page-not-found.component';
import { PageErrorComponent } from './home/page-error/page-error.component';
import { LogOutComponent } from './home/log-out/log-out.component';
import { AppConfig } from './app.config';
import { AppInsights } from 'applicationinsights-js';

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
        ValidationModule,
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
        { provide: UrlSerializer, useClass: LowerCaseUrlSerializer }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
