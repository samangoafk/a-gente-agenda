import { Injectable, inject, signal, computed } from '@angular/core';
import { Agendamento } from '../../models/agendamento.model'; 
import { AuthService } from './auth.services';

@Injectable({
  providedIn: 'root'
})
export class SalasService {
  private authService = inject(AuthService);

  private agendamentosSignal = signal<Agendamento[]>([
    {
      id: 1,
      salaId: 101,
      salaNome: 'Lab de Informática 01',
      tipo: 'LABORATÓRIO',
      professorId: 1,
      professorNome: 'Adam Castro',
      materia: 'Design de Interfaces',
      data: '2025-05-26',
      dataFormatada: '26 de maio de 2025',
      dia: '26',
      mes: 'MAI',
      horario: '08:00 — 09:30',
      status: 'Confirmado'
    }
  ]);

  meusAgendamentos = computed(() => {
    const usuario = this.authService.usuarioLogado();
    if (!usuario) return [];
    return this.agendamentosSignal().filter(a => a.professorId === usuario.id);
  });

  //Todos agendamentos visão do coodernador
  todosAgendamentos = this.agendamentosSignal.asReadonly();

  adicionarAgendamento(novoAgendamento: Omit<Agendamento, 'id'>): void {
    const agendamentoCompleto: Agendamento = {
      ...novoAgendamento,
      id: Date.now()
    };

    this.agendamentosSignal.update(lista => [agendamentoCompleto, ...lista]);
  }

  atualizarStatus(id: number, status: 'Confirmado' | 'Pendente' | 'Cancelado'): void {
  this.agendamentosSignal.update((lista: Agendamento[]) =>
    lista.map((a: Agendamento): Agendamento =>
      a.id === id ? { ...a, status } : a
    )
  );
}

  // Edita a descrição de um agendamento. Só o dono pode editar, e apenas enquanto estiver pendente.
  atualizarDescricao(id: number, descricao: string): boolean {
    const usuario = this.authService.usuarioLogado();
    if (!usuario) return false;

    let alterado = false;

    this.agendamentosSignal.update((lista: Agendamento[]) =>
      lista.map((a: Agendamento): Agendamento => {
        if (a.id === id && a.professorId === usuario.id && a.status === 'Pendente') {
          alterado = true;
          return { ...a, descricao: descricao.trim() || undefined };
        }
        return a;
      })
    );

    return alterado;
  }
}