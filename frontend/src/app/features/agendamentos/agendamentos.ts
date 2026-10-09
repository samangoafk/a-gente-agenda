import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../shared/components/header/header';

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

  salaId: number | null = null;
  salaNome: string = 'Laboratório de Informática 01';

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
  }

  // Fecha o modal e redireciona de volta para /salas
  fecharEVoltar(): void {
    this.mostrarModalSucesso = false;
    this.router.navigate(['/salas']);
  }
}