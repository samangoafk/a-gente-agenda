import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { CardStatusSala } from '../../shared/components/card-status-sala/card-status-sala';
import { PopUpReservaSala } from '../../shared/components/pop-up-reserva-sala/pop-up-reserva-sala';

interface Sala {
  id: number;
  nome: string;
  tipo: string;
  capacidade: number;
  status: 'livre' | 'ocupado' | 'manutencao';
  proximoHorario?: string;
}

@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [CommonModule, Header, CardStatusSala, PopUpReservaSala],
  templateUrl: './salas.html',
  styleUrl: './salas.css'
})
export class Salas implements OnInit, OnDestroy {
  private router = inject(Router);

  dataAtualFormatada: string = '';
  private timerId: any;

  exibirModal: boolean = false;
  salaSelecionadaId: number | null = null;
  salaSelecionadaNome: string = '';
  salaSelecionadaStatus: 'livre' | 'ocupado' | 'manutencao' = 'livre';
  filtroAtual: 'todos' | 'livre' = 'todos';
  listaSalas: Sala[] = [
    { id: 1, nome: 'Laboratório de Informática 01', tipo: 'Laboratório', capacidade: 32, status: 'livre', proximoHorario: '13:30' },
    { id: 2, nome: 'Laboratório de Informática 02', tipo: 'Laboratório', capacidade: 28, status: 'ocupado', proximoHorario: '15:30' },
    { id: 3, nome: 'Sala de Teoria 102', tipo: 'Sala de Aula', capacidade: 40, status: 'livre', proximoHorario: '14:00' },
    { id: 4, nome: 'Oficina de Automação', tipo: 'Oficina', capacidade: 20, status: 'manutencao' },
    { id: 5, nome: 'Laboratório de Redes', tipo: 'Laboratório', capacidade: 25, status: 'livre' },
    { id: 6, nome: 'Auditório Principal', tipo: 'Auditório', capacidade: 120, status: 'livre', proximoHorario: '18:00' }
  ];

  ngOnInit(): void {
    // Atualiza imediatamente ao carregar
    this.atualizarDataCompleta();

    this.timerId = setInterval(() => {
      this.atualizarDataCompleta();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  private atualizarDataCompleta(): void {
    const agora = new Date();
    
    const dataExtenso = agora.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    });
    
    const horaExtenso = agora.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    this.dataAtualFormatada = `${dataExtenso} - ${horaExtenso}`.toUpperCase();
  }

  get salasExibidas(): Sala[] {
    if (this.filtroAtual === 'livre') {
      return this.listaSalas.filter(sala => sala.status === 'livre');
    }
    return this.listaSalas;
  }

  alterarFiltro(status: 'todos' | 'livre') {
    this.filtroAtual = status;
  }

  abrirModalReserva(id: number) {
    const sala = this.listaSalas.find(s => s.id === id);
    if (sala) {
      this.salaSelecionadaId = sala.id;
      this.salaSelecionadaNome = sala.nome;
      this.salaSelecionadaStatus = sala.status;
      this.exibirModal = true;
    }
  }

  fecharModal() {
    this.exibirModal = false;
    this.salaSelecionadaId = null;
  }

  confirmarReservaModal() {
    this.exibirModal = false;
    if (this.salaSelecionadaId) {
      this.router.navigate(['/agendamentos', this.salaSelecionadaId]);
    }
  }

  alterarDataModal() {
    this.exibirModal = false;
  }
}