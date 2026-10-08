import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { SalasService } from '../../core/services/salas.services';

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
}