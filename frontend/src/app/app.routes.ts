import { Routes } from '@angular/router';
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
    loadComponent: () =>
      import('./features/salas/salas').then(m => m.Salas)
  },

  {
    path: 'agendamentos/:id',
    loadComponent: () =>
      import('./features/agendamentos/agendamentos')
        .then(m => m.Agendamentos)
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];