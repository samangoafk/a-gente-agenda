import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.services';

export const coordenadorGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) return true; // no servidor (SSR) deixa passar

  const authService = inject(AuthService);
  const router = inject(Router);
  const usuario = authService.usuarioLogado();

  if (usuario?.perfil === 'Coordenador') {
    return true;
  }

  // Logado mas sem permissão vai para as salas; deslogado vai para o login
  return router.createUrlTree([usuario ? '/salas' : '/login']);
};