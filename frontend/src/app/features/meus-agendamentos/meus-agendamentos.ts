import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { SalasService } from '../../core/services/salas.services';
import { Agendamento } from '../../models/agendamento.model';

@Component({
  selector: 'app-meus-agendamentos',
  standalone: true,
  imports: [CommonModule, RouterLink, Header],
  templateUrl: './meus-agendamentos.html',
  styleUrl: './meus-agendamentos.css'
})
export class MeusAgendamentos {
  private salasService = inject(SalasService);

  // Acessa o signal computado de agendamentos
  agendamentos = this.salasService.meusAgendamentos;

  // Edição da descrição (modal)
  agendamentoEmEdicao = signal<Agendamento | null>(null);
  descricaoEdicao = signal('');
  readonly limiteDescricao = 300;

  // Só dá para editar enquanto o coordenador ainda não decidiu
  podeEditar(item: Agendamento): boolean {
    return item.status === 'Pendente';
  }

  abrirEdicao(item: Agendamento): void {
    this.agendamentoEmEdicao.set(item);
    this.descricaoEdicao.set(item.descricao ?? '');
  }

  @HostListener('document:keydown.escape')
  fecharEdicao(): void {
    this.agendamentoEmEdicao.set(null);
  }

  atualizarDescricao(evento: Event): void {
    this.descricaoEdicao.set((evento.target as HTMLTextAreaElement).value);
  }

  salvarEdicao(): void {
    const item = this.agendamentoEmEdicao();
    if (!item) return;

    this.salasService.atualizarDescricao(item.id, this.descricaoEdicao());
    this.fecharEdicao();
  }
}