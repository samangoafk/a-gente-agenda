import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
// import { Salas } from './features/salas/salas';
// import { Agendamentos } from './features/agendamentos/agendamentos'; 

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login').then(m => m.Login)
  },

  {
    path: 'salas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/salas/salas').then(m => m.Salas)
  },

  {
    path: 'agendamentos/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/agendamentos/agendamentos')
        .then(m => m.Agendamentos)
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];