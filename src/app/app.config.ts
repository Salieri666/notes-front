import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideApiConfiguration } from './_api/api-configuration';
import { errorInterceptor } from './core/interceptor/error.interceptor';
// Импортируем новые функциональные элементы
import {
  provideKeycloak,
  includeBearerTokenInterceptor,
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG
} from 'keycloak-angular';


// Альтернатива: условие на основе URL-паттерна для всех HTTP-запросов (например, если All не поддерживается)
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
        includeBearerTokenInterceptor,  // Функциональный интерцептор для bearer-токена
        errorInterceptor
      ])
    ),
    // Конфигурация условий для интерцептора (используйте allCondition или universalCondition)
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [universalCondition]  // Или [universalCondition] для URL-матчинга; можно добавить несколько условий
    },
    provideApiConfiguration('http://localhost:8090/notes-service'),
    provideKeycloak({
      config: {
        url: 'http://192.168.0.240:8082',
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
