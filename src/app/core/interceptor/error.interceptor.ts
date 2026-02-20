import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import {NotificationService} from '../service/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Произошла неизвестная ошибка';

      if (error.error instanceof ErrorEvent) {
        // Ошибка на стороне клиента
        errorMessage = `Ошибка: ${error.error.message}`;
      } else {
        // Ошибка на стороне сервера
        switch (error.status) {
          case 400: errorMessage = 'Некорректный запрос (400)'; break;
          case 401: errorMessage = 'Не авторизован (401)'; break;
          case 404: errorMessage = 'Ресурс не найден (404)'; break;
          case 500: errorMessage = 'Ошибка сервера (500)'; break;
          default: errorMessage = `Код ошибки: ${error.status}\nСообщение: ${error.message}`;
        }
      }

      notify.showError(errorMessage);
      return throwError(() => error);
    })
  );
};
