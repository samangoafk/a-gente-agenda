import { Injectable, inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Agendamento } from '../../models/agendamento.model'; 
import { AuthService } from './auth.services';

@Injectable({
  providedIn: 'root'
})
export class SalasService {
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Inicializa buscando do localStorage para não perder a desgraça dos agendamentos ao recarregar/fazer logout
  private agendamentosSignal = signal<Agendamento[]>(this.carregarAgendamentos());

  meusAgendamentos = computed(() => {
    const usuario = this.authService.usuarioLogado();
    if (!usuario) return [];
    return this.agendamentosSignal().filter(
      a => Number(a.professorId) === Number(usuario.id)
    );
  });

  todosAgendamentos = this.agendamentosSignal.asReadonly();

  private carregarAgendamentos(): Agendamento[] {
    if (this.isBrowser) {
      const dados = localStorage.getItem('agendamentos');
      if (dados) {
        try {
          return JSON.parse(dados);
        } catch {
          return [];
        }
      }
    }
    return [];
  }

  private salvarNoStorage(lista: Agendamento[]): void {
    if (this.isBrowser) {
      localStorage.setItem('agendamentos', JSON.stringify(lista));
    }
  }

  adicionarAgendamento(novoAgendamento: Omit<Agendamento, 'id'>): void {
    const agendamentoCompleto: Agendamento = {
      ...novoAgendamento,
      id: Date.now()
    };

    this.agendamentosSignal.update((lista: Agendamento[]) => {
      const novaLista = [agendamentoCompleto, ...lista];
      this.salvarNoStorage(novaLista);
      return novaLista;
    });
  }

  atualizarStatus(id: number, status: 'Confirmado' | 'Pendente' | 'Cancelado'): void {
    this.agendamentosSignal.update((lista: Agendamento[]) => {
      const novaLista = lista.map((a: Agendamento): Agendamento =>
        a.id === id ? { ...a, status } : a
      );
      this.salvarNoStorage(novaLista);
      return novaLista;
    });
  }

  atualizarDescricao(id: number, descricao: string): boolean {
    const usuario = this.authService.usuarioLogado();
    if (!usuario) return false;

    let alterado = false;

    this.agendamentosSignal.update((lista: Agendamento[]) => {
      const novaLista = lista.map((a: Agendamento): Agendamento => {
        if (a.id === id && Number(a.professorId) === Number(usuario.id) && a.status === 'Pendente') {
          alterado = true;
          return { ...a, descricao: descricao.trim() || undefined };
        }
        return a;
      });

      if (alterado) {
        this.salvarNoStorage(novaLista);
      }

      return novaLista;
    });

    return alterado;
  }
}