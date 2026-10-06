import { inject } from '@angular/core';
import { Router} from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.services';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()){
    return true;
  }
  return router.createUrlTree(['/login']);

};
