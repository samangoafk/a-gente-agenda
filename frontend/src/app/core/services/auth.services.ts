import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Usuario {
  id: number;
  nome: string;
  login: string;
  senha: string;
  perfil: 'Professor' | 'Coordenador';
  materia?: string;
  solicitacoesPendentes?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  private readonly usuariosMock: Usuario[] = [
    {
      id: 1,
      nome: 'Adam Castro',
      login: 'adamuscastro133@gmail.com',
      senha: '12345',
      perfil: 'Professor',
      materia: 'Design de Interfaces',
      solicitacoesPendentes: 2
    },
    {
      id: 2,
      nome: 'Matheus Dias',
      login: 'matheus.a.dias.contato@gmail.com',
      senha: '12345',
      perfil: 'Professor',
      materia: 'Desenvolvimento Web',
      solicitacoesPendentes: 1
    },
    {
      id: 3,
      nome: 'Yuri',
      login: 'yurim.contato@gmail.com',
      senha: '12345',
      perfil: 'Coordenador'
    }
  ];

  usuarioLogado = signal<Usuario | null>(this.recuperarSessao());

  iniciais = computed(() => {
    const usuario = this.usuarioLogado();
    if (!usuario || !usuario.nome) return '';

    const partes = usuario.nome.trim().split(/\s+/);
    if (partes.length === 1) {
      return partes[0].substring(0, 2).toUpperCase();
    }
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  });

  private recuperarSessao(): Usuario | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const salvo = localStorage.getItem('usuarioLogado');
    return salvo ? JSON.parse(salvo) : null;
  }

  login(login: string, senha: string): boolean {
    const encontrado = this.usuariosMock.find(
      (u) => u.login.toLowerCase() === login.trim().toLowerCase() && u.senha === senha
    );

    if (encontrado) {
      this.usuarioLogado.set(encontrado);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('usuarioLogado', JSON.stringify(encontrado));
      }
      return true;
    }

    return false;
  }

  loginRapido(email: string): boolean {
    const encontrado = this.usuariosMock.find(
      (u) => u.login.toLowerCase() === email.trim().toLowerCase()
    );

    if (encontrado) {
      this.usuarioLogado.set(encontrado);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('usuarioLogado', JSON.stringify(encontrado));
      }
      return true;
    }

    return false;
  }

  logout(): void {
    this.usuarioLogado.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('usuarioLogado');
    }
  }

  estaAutenticado(): boolean {
    return this.usuarioLogado() !== null;
  }

  obterUsuarioLogado(): Usuario | null {
    return this.usuarioLogado();
  }

  obterIniciais(): string {
    return this.iniciais();
  }
}