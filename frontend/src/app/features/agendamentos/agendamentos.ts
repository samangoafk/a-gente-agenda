import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../shared/components/header/header';

export interface HorarioSlot {
  inicio: string;
  fim: string;
  livre: boolean;
  professor?: string;
  disciplina?: string;
}

interface SalaMock {
  id: number;
  nome: string;
  status: 'livre' | 'ocupado' | 'manutencao';
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
  private location = inject(Location);

  salaId: number | null = null;
  salaNome: string = 'Sala Multimídia';

  // Base de dados mock para buscar o nome pelo id recebido da rota
  private mockSalas: SalaMock[] = [
    { id: 1, nome: 'Laboratório de Informática 01', status: 'livre' },
    { id: 2, nome: 'Laboratório de Informática 02', status: 'ocupado' },
    { id: 3, nome: 'Sala de Teoria 102', status: 'livre' },
    { id: 4, nome: 'Oficina de Automação', status: 'manutencao' },
    { id: 5, nome: 'Laboratório de Redes', status: 'livre' },
    { id: 6, nome: 'Auditório Principal', status: 'livre' }
  ];

  materias: string[] = [
    'Design de Interfaces',
    'Algoritmos I',
    'Engenharia de Software',
    'Redes de Computadores'
  ];
  materiaSelecionada: string = 'Design de Interfaces';

  horarios: HorarioSlot[] = [
    { inicio: '08:00', fim: '09:30', livre: true },
    { inicio: '09:30', fim: '11:00', livre: false, professor: 'Paulo Mendes', disciplina: 'Algoritmos I' },
    { inicio: '11:00', fim: '12:30', livre: true },
    { inicio: '13:00', fim: '14:30', livre: false, professor: 'Ana Costa', disciplina: 'Redes' },
    { inicio: '14:30', fim: '16:00', livre: true },
    { inicio: '16:00', fim: '17:30', livre: true }
  ];

  horarioSelecionado: HorarioSlot | null = this.horarios[4];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.salaId = Number(id);
      const salaEncontrada = this.mockSalas.find(s => s.id === this.salaId);
      if (salaEncontrada) {
        this.salaNome = salaEncontrada.nome;
      }
    }
  }

  selecionarHorario(horario: HorarioSlot): void {
    if (horario.livre) {
      this.horarioSelecionado = horario;
    }
  }

  voltar(): void {
    this.location.back();
  }

  confirmarAgendamento(): void {
    if (!this.horarioSelecionado) return;
    alert(`Solicitação de Agendamento confirmada para ${this.salaNome} das ${this.horarioSelecionado.inicio} às ${this.horarioSelecionado.fim}. Você será notificado quando o coordenador validar seu agendamento.`);
    this.router.navigate(['/salas']);
  }
}