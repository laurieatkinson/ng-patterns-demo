import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from 'environments/environment';
import { AppModule } from 'app/app.module';
import { AppConfig } from 'app/app.config';
import { AppInjector } from 'app/app-injector.service';

if (environment.name !== 'dev') {
  enableProdMode();
}

// AppConfig.load()
//     .then(() => {
        platformBrowserDynamic().bootstrapModule(AppModule).then((moduleRef) => {
            AppInjector.getInstance().setInjector(moduleRef.injector);
        });
//    });
