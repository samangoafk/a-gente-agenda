import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Usuario } from '../../../models/usuarios.model';

@Component({
  selector: 'app-pop-up-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pop-up-perfil.html',
  styleUrl: './pop-up-perfil.css'
})
export class PopUpPerfil {
  private router = inject(Router);

  @Input() exibe: boolean = false;
  @Input() usuario: Usuario | null = null;
  @Input() iniciais: string = 'US';

  @Output() fechar = new EventEmitter<void>();
  @Output() verPerfil = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onFechar(): void {
    this.fechar.emit();
  }

  onVerPerfil(): void {
    this.verPerfil.emit();
    this.fechar.emit();
    this.router.navigate(['/perfil']);
  }

  onLogout(): void {
    this.logout.emit();
  }
}