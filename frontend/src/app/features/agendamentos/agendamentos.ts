import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { SalasService } from '../../core/services/salas.services';
import { AuthService } from '../../core/services/auth.services';

interface SlotHorario {
  inicio: string;
  fim: string;
  livre: boolean;
  professor?: string;
  disciplina?: string;
}

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, Header],
  templateUrl: './agendamentos.html',
  styleUrl: './agendamentos.css'
})
export class Agendamentos implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private salasService = inject(SalasService); 

  salaId: number | null = null;
  salaNome: string = 'Laboratório de Informática 01';
  salaTipo: string = 'Laboratório';

  dataSelecionada: Date = new Date();
  dataLargaFormatada: string = '';
  dataCurtaFormatada: string = '';

  // Controle de exibição do modal customizado
  mostrarModalSucesso: boolean = false;

  materias: string[] = [
    'Desenvolvimento Web',
    'Algoritmos e Estrutura de Dados',
    'Banco de Dados',
    'Redes de Computadores'
  ];
  materiaSelecionada: string = this.materias[0];

  horarios: SlotHorario[] = [
    { inicio: '07:30', fim: '09:10', livre: true },
    { inicio: '09:20', fim: '11:00', livre: false, professor: 'Prof. Carlos', disciplina: 'Sistemas Operacionais' },
    { inicio: '13:30', fim: '15:10', livre: true },
    { inicio: '15:20', fim: '17:00', livre: true },
    { inicio: '19:00', fim: '20:40', livre: false, professor: 'Profª. Ana', disciplina: 'Engenharia de Software' }
  ];

  horarioSelecionado: SlotHorario | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.salaId = Number(idParam);
    }

    const dataQuery = this.route.snapshot.queryParamMap.get('data');
    if (dataQuery) {
      const partes = dataQuery.split('-');
      if (partes.length === 3) {
        this.dataSelecionada = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
      }
    }

    const nomeQuery = this.route.snapshot.queryParamMap.get('nome');
    const tipoQuery = this.route.snapshot.queryParamMap.get('tipo');
    if (nomeQuery) this.salaNome = nomeQuery;
    if (tipoQuery) this.salaTipo = tipoQuery;

    this.formatarDatas();
  }

  private formatarDatas(): void {
    const dataLarga = this.dataSelecionada.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    this.dataLargaFormatada = dataLarga.charAt(0).toUpperCase() + dataLarga.slice(1);

    this.dataCurtaFormatada = this.dataSelecionada.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long'
    });
  }

  selecionarHorario(slot: SlotHorario): void {
    if (!slot.livre) return;
    this.horarioSelecionado = slot;
  }

  voltar(): void {
    this.router.navigate(['/salas']);
  }

  // Aciona o modal em vez de usar alert()
  
  confirmarAgendamento(): void {
    if (this.horarioSelecionado) {
      this.mostrarModalSucesso = true;
    }
  const usuario = this.authService.usuarioLogado();
  if (!this.horarioSelecionado || !usuario || this.salaId === null) return;

  const d = this.dataSelecionada;
  const ano = d.getFullYear();
  const mesNum = String(d.getMonth() + 1).padStart(2, '0');
  const diaNum = String(d.getDate()).padStart(2, '0');
  const horario = `${this.horarioSelecionado.inicio} — ${this.horarioSelecionado.fim}`;

  // Evita pedir um horário que já tem solicitação ativa
  const conflito = this.salasService.todosAgendamentos().some(a =>
    a.salaId === this.salaId &&
    a.data === `${ano}-${mesNum}-${diaNum}` &&
    a.horario === horario &&
    a.status !== 'Cancelado'
  );
  if (conflito) {
    alert('Já existe uma solicitação para esse horário. Escolha outro.');
    return;
  }

  this.salasService.adicionarAgendamento({
    salaId: this.salaId,
    salaNome: this.salaNome,
    tipo: this.salaTipo.toUpperCase(),
    professorId: usuario.id,
    professorNome: usuario.nome,
    materia: this.materiaSelecionada,
    data: `${ano}-${mesNum}-${diaNum}`,
    dataFormatada: d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
    dia: diaNum,
    mes: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase(),
    horario,
    status: 'Pendente'
  });

  this.router.navigate(['/meus-agendamentos']);
}

  // Fecha o modal e redireciona de volta para /salas
  fecharEVoltar(): void {
    this.mostrarModalSucesso = false;
    this.router.navigate(['/salas']);
  }
}