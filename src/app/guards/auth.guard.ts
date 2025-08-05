import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  
  // Verifica si existe el token de autenticación falso
  const isAuthenticated = localStorage.getItem('fakeAuth') !== null;

  return isAuthenticated || router.createUrlTree(['/home']);
};