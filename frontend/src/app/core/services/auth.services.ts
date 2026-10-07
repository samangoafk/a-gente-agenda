import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Usuario } from '../../models/usuarios.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  private usuarios: Usuario[] = [
    {
      id: 1,
      nome: 'Adam Castro',
      login: 'adam67@gmail.com',
      senha: '12345',
      perfil: 'Professor'
    },
    {
      id: 2,
      nome: 'Yuri Marques',
      login: 'yuriaura@gmail.com',
      senha: 'aura67',
      perfil: 'Coordenador'
    },
    {
      id: 3,
      nome: 'Matheus Dias',
      login: 'matheusresende@gmail.com',
      senha: 'aura67',
      perfil: 'Professor'
    }
  ];

  private usuarioLogado: Usuario | null = null;

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(login: string, senha: string): boolean {
    const usuario = this.usuarios.find(
      u => u.login === login && u.senha === senha
    );

    if (!usuario) {
      return false;
    }

    this.usuarioLogado = usuario;

    if (this.isBrowser) {
      localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    }

    return true;
  }

  logout(): void {
    this.usuarioLogado = null;
    if (this.isBrowser) {
      localStorage.removeItem('usuarioLogado');
    }
  }

  estaAutenticado(): boolean {
    if (this.isBrowser) {
      return localStorage.getItem('usuarioLogado') !== null;
    }
    return false;
  }

  obterUsuarioLogado(): Usuario | null {
    if (this.usuarioLogado) {
      return this.usuarioLogado;
    }

    if (this.isBrowser) {
      const usuarioStorage = localStorage.getItem('usuarioLogado');
      if (usuarioStorage) {
        this.usuarioLogado = JSON.parse(usuarioStorage);
        return this.usuarioLogado;
      }
    }

    return null;
  }

  obterIniciais(): string {
    const usuario = this.obterUsuarioLogado();
    if (!usuario || !usuario.nome) return 'US';

    const partes = usuario.nome.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }
    return usuario.nome.substring(0, 2).toUpperCase();
  }
}