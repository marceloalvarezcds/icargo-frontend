import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular';
import { BrowserTracing } from '@sentry/tracing';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.sentryUrl) {
  Sentry.init({
    dsn: environment.sentryUrl,
    integrations: [
      new BrowserTracing({
        tracePropagationTargets: [
          'localhost',
          environment.api,
          environment.baseUrl,
        ],
        routingInstrumentation: Sentry.routingInstrumentation,
      }),
    ],
    tracesSampleRate: 1.0,
  });
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
