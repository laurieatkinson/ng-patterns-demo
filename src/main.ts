import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from 'environments/environment';
import { AppModule } from 'app/app.module';
import { AppInjector } from 'app/app-injector.service';

if (environment.name !== 'dev') {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).then((moduleRef) => {
    AppInjector.getInstance().setInjector(moduleRef.injector);
});

// git remote set-url --add --push origin https://laurieatkinson.visualstudio.com/NgPatternsDemo/_git/NgPatternsDemo
// git remote set-url --add --push origin https://github.com/laurieatkinson/ng-patterns-demo.git
