import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import Keycloak from 'keycloak-js';

export const authGuard: CanActivateFn = async () => {
  const keycloak = inject(Keycloak);

  // Свойство authenticated
  if (keycloak.authenticated) {
    return true;
  }

  await keycloak.login();
  return false;
};
