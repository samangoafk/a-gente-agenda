import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { SalasService } from '../../core/services/salas.services';
import { AuthService } from '../../core/services/auth.services';
import { Agendamento } from '../../models/agendamento.model';

type FiltroStatus = 'Pendente' | 'Confirmado' | 'Cancelado' | 'Todos';

@Component({
  selector: 'app-coordenador',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './coordenador.html',
  styleUrl: './coordenador.css'
})
export class Coordenador {
  private salasService = inject(SalasService);
  private authService = inject(AuthService);

  nomeUsuario = computed(() => this.authService.usuarioLogado()?.nome ?? '');

  filtroAtual = signal<FiltroStatus>('Pendente');
  busca = signal('');

  filtros: FiltroStatus[] = ['Pendente', 'Confirmado', 'Cancelado', 'Todos'];

  private todos = this.salasService.todosAgendamentos;

  totalPendentes = computed(() => this.todos().filter(a => a.status === 'Pendente').length);
  totalConfirmados = computed(() => this.todos().filter(a => a.status === 'Confirmado').length);
  totalCancelados = computed(() => this.todos().filter(a => a.status === 'Cancelado').length);
  total = computed(() => this.todos().length);

  agendamentosFiltrados = computed(() => {
    const filtro = this.filtroAtual();
    const termo = this.busca().trim().toLowerCase();

    return this.todos().filter(a => {
      const passaStatus = filtro === 'Todos' || a.status === filtro;
      const passaBusca =
        !termo ||
        a.professorNome.toLowerCase().includes(termo) ||
        a.salaNome.toLowerCase().includes(termo) ||
        a.materia.toLowerCase().includes(termo);
      return passaStatus && passaBusca;
    });
  });

  dataHoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  alterarFiltro(filtro: FiltroStatus): void {
    this.filtroAtual.set(filtro);
  }

  atualizarBusca(evento: Event): void {
    this.busca.set((evento.target as HTMLInputElement).value);
  }

  contagem(filtro: FiltroStatus): number {
    switch (filtro) {
      case 'Pendente': return this.totalPendentes();
      case 'Confirmado': return this.totalConfirmados();
      case 'Cancelado': return this.totalCancelados();
      default: return this.total();
    }
  }

  aprovar(item: Agendamento): void {
    this.salasService.atualizarStatus(item.id, 'Confirmado');
  }

  recusar(item: Agendamento): void {
    this.salasService.atualizarStatus(item.id, 'Cancelado');
  }

  classeStatus(status: Agendamento['status']): string {
    return 'status-' + status.toLowerCase();
  }
}