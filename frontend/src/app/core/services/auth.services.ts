import { Injectable, inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Usuario } from '../../models/usuarios.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Lista mockada com matéria e perfis configurados
  private usuarios: Usuario[] = [
    {
      id: 1,
      nome: 'Adam Castro',
      login: 'adam67@gmail.com',
      senha: '12345',
      perfil: 'Professor',
      materia: 'Design de Interfaces',
      solicitacoesPendentes: 2
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
      perfil: 'Professor',
      materia: 'Desenvolvimento de Software',
      solicitacoesPendentes: 0
    }
  ];

  // Signal reativo para o estado do usuário logado
  usuarioLogado = signal<Usuario | null>(this.obterUsuarioInicial());

  // Signal computado para verificação de autenticação
  estaAutenticado = computed(() => this.usuarioLogado() !== null);

  // Signal computado que gera as iniciais do avatar de maneira "dinâmica"
  iniciais = computed(() => {
    const usuario = this.usuarioLogado();
    if (!usuario || !usuario.nome) return 'US';

    const partes = usuario.nome.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }
    return usuario.nome.substring(0, 2).toUpperCase();
  });

  private obterUsuarioInicial(): Usuario | null {
    if (this.isBrowser) {
      const usuarioStorage = localStorage.getItem('usuarioLogado');
      if (usuarioStorage) {
        try {
          return JSON.parse(usuarioStorage);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  login(login: string, senha: string): boolean {
    const usuario = this.usuarios.find(
      u => u.login === login && u.senha === senha
    );

    if (!usuario) {
      return false;
    }

    this.usuarioLogado.set(usuario);

    if (this.isBrowser) {
      localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    }

    return true;
  }

  logout(): void {
    this.usuarioLogado.set(null);
    if (this.isBrowser) {
      localStorage.removeItem('usuarioLogado');
    }
  }

  // Métodos utilitários para compatibilidade sem alterar a API publics
  obterUsuarioLogado(): Usuario | null {
    return this.usuarioLogado();
  }

  obterIniciais(): string {
    return this.iniciais();
  }
}