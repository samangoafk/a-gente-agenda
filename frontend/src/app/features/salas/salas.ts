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

interface DiaCalendario {
  data: Date;
  numeroDia: number;
  mesAtual: boolean;
  desabilitado: boolean;
  selecionado: boolean;
  hoje: boolean;
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

  // Relógio em tempo real
  dataAtualFormatada: string = '';
  private timerId: any;

  // Calendário Customizado
  exibirCalendario: boolean = false;
  dataReservaSelecionada: Date = new Date();
  mesExibicaoCalendario: Date = new Date();
  diasCalendario: DiaCalendario[] = [];
  diasDaSemana: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Controle de Modal e Lista
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
    this.atualizarDataCompleta();
    this.timerId = setInterval(() => {
      this.atualizarDataCompleta();
    }, 1000);

    this.gerarCalendario();
  }

  ngOnDestroy(): void {
    if (this.timerId) clearInterval(this.timerId);
  }

  private atualizarDataCompleta(): void {
    const agora = new Date();
    const dataExtenso = agora.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
    const horaExtenso = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.dataAtualFormatada = `${dataExtenso} - ${horaExtenso}`.toUpperCase();
  }

  // --- LÓGICA DO CALENDÁRIO ---

  toggleCalendario(): void {
    this.exibirCalendario = !this.exibirCalendario;
  }

  mudarMes(delta: number): void {
    this.mesExibicaoCalendario = new Date(
      this.mesExibicaoCalendario.getFullYear(),
      this.mesExibicaoCalendario.getMonth() + delta,
      1
    );
    this.gerarCalendario();
  }

  selecionarData(dia: DiaCalendario): void {
    if (dia.desabilitado) return;

    this.dataReservaSelecionada = new Date(dia.data);
    this.exibirCalendario = false;
    this.gerarCalendario();
  }

  gerarCalendario(): void {
    const ano = this.mesExibicaoCalendario.getFullYear();
    const mes = this.mesExibicaoCalendario.getMonth();

    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);

    const diaInicialSemana = primeiroDia.getDay();
    const totalDiasMes = ultimoDia.getDate();

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dias: DiaCalendario[] = [];

    const diasMesAnterior = new Date(ano, mes, 0).getDate();
    for (let i = diaInicialSemana - 1; i >= 0; i--) {
      const d = new Date(ano, mes - 1, diasMesAnterior - i);
      dias.push({
        data: d,
        numeroDia: d.getDate(),
        mesAtual: false,
        desabilitado: true,
        selecionado: false,
        hoje: false
      });
    }

    for (let i = 1; i <= totalDiasMes; i++) {
      const d = new Date(ano, mes, i);
      const dataComparacao = new Date(ano, mes, i);
      dataComparacao.setHours(0, 0, 0, 0);

      const diaSemana = d.getDay();
      const ehFimDeSemana = diaSemana === 0 || diaSemana === 6;
      const ehPassado = dataComparacao < hoje;

      const desabilitado = ehPassado || ehFimDeSemana;
      const selecionado = this.mesmasDatas(dataComparacao, this.dataReservaSelecionada);
      const ehHoje = this.mesmasDatas(dataComparacao, hoje);

      dias.push({
        data: d,
        numeroDia: i,
        mesAtual: true,
        desabilitado,
        selecionado,
        hoje: ehHoje
      });
    }

    const totalPreenchido = dias.length;
    const restante = 42 - totalPreenchido;
    for (let i = 1; i <= restante; i++) {
      const d = new Date(ano, mes + 1, i);
      dias.push({
        data: d,
        numeroDia: i,
        mesAtual: false,
        desabilitado: true,
        selecionado: false,
        hoje: false
      });
    }

    this.diasCalendario = dias;
  }

  private mesmasDatas(d1: Date, d2: Date): boolean {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  get dataReservaTexto(): string {
    return this.dataReservaSelecionada.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'long'
    });
  }

  get mesAnoExibicao(): string {
    return this.mesExibicaoCalendario.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  }

  // --- LÓGICA DE NAVEGAÇÃO E MODAL ---

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
      const dataIso = this.dataReservaSelecionada.toISOString().split('T')[0];
      // Redireciona para a tela de agendamentos passando o ID da sala e a data selecionada
      this.router.navigate(['/agendamentos', this.salaSelecionadaId], {
        queryParams: { data: dataIso }
      });
    }
  }

  alterarDataModal() {
    this.exibirModal = false;
    this.exibirCalendario = true;
  }
}