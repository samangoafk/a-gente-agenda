import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.services';
import { SalasService } from '../../core/services/salas.services';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink, Header],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {
  private authService = inject(AuthService);
  private salasService = inject(SalasService);
  private router = inject(Router);

  usuario = this.authService.usuarioLogado;
  iniciais = this.authService.iniciais;

  ehCoordenador = computed(() => this.usuario()?.perfil === 'Coordenador');

  // Apenas para professores: filtro de status das próprias solicitações
  filtroStatus = signal<'Pendente' | 'Confirmado' | 'Cancelado'>('Pendente');

  minhasSolicitacoes = this.salasService.meusAgendamentos;

  solicitacoesFiltradas = computed(() =>
    this.minhasSolicitacoes().filter(a => a.status === this.filtroStatus())
  );

  qtdPendentes = computed(() => this.minhasSolicitacoes().filter(a => a.status === 'Pendente').length);
  qtdAceitos = computed(() => this.minhasSolicitacoes().filter(a => a.status === 'Confirmado').length);
  qtdRecusados = computed(() => this.minhasSolicitacoes().filter(a => a.status === 'Cancelado').length);

  selecionarFiltro(status: 'Pendente' | 'Confirmado' | 'Cancelado'): void {
    this.filtroStatus.set(status);
  }

  extrairHorarioInicial(horario: string): string {
    return horario ? horario.split(/[—-]/)[0].trim() : '';
  }

  contatarCoordenador(): void {
    alert('Redirecionando para o canal de contato com a coordenação (yuri@gmail.com).');
  }

  trocarSenha(): void {
    alert('Funcionalidade de redefinição de senha em breve!');
  }

  sairDaConta(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}