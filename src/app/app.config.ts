import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideApiConfiguration } from './_api/api-configuration';
import { errorInterceptor } from './core/interceptor/error.interceptor';

import {
  provideKeycloak,
  includeBearerTokenInterceptor,
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG
} from 'keycloak-angular';
import {environment} from '../environments/environment';

const universalCondition = createInterceptorCondition({
  urlPattern: /^https?:\/\/.*/i,  // Матчит все HTTP/HTTPS URL
  bearerPrefix: 'Bearer'
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        includeBearerTokenInterceptor,
        errorInterceptor
      ])
    ),
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [universalCondition]
    },
    provideApiConfiguration(environment.apiUrl),
    provideKeycloak({
      config: {
        url: environment.keycloakUrl,
        realm: 'notes-realm',
        clientId: 'notes-client-public'
      },
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false
        // Если используете silent SSO, добавьте: silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
        // И создайте файл silent-check-sso.html в assets/ с содержимым: <html><body><script>parent.postMessage(location.href, location.origin);</script></body></html>
      }
    })
  ]
};
