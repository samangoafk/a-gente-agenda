import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.services';
import { Usuario } from '../../../models/usuarios.model';
import { PopUpPerfil } from '../pop-up-perfil/pop-up-perfil';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, PopUpPerfil],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);

  exibirPopUpPerfil: boolean = false;

  get usuario(): Usuario | null {
    return this.authService.obterUsuarioLogado();
  }

  get iniciais(): string {
    return this.authService.obterIniciais();
  }

  abrirPopUpPerfil(): void {
    this.exibirPopUpPerfil = true;
  }

  fecharPopUpPerfil(): void {
    this.exibirPopUpPerfil = false;
  }

  verPerfil(): void {
    this.fecharPopUpPerfil();
    this.router.navigate(['/perfil']);
  }

  logout(): void {
    this.fecharPopUpPerfil();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}