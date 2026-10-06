import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.services';
import { Usuario } from '../../models/usuarios.model';

@Injectable({
    providedIn: 'root'
})
export class AuthFacade {
    private authService = inject(AuthService);
    private router = inject(Router);

    login(login: string, senha: string) : boolean {

        const loginRealizado = this.authService.login(login, senha);

        if (loginRealizado){
            this.router.navigate(['/salas']);
        }

        return loginRealizado;
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    estaAutenticado(): boolean {
        return this.authService.estaAutenticado();
    }

    obterUsuarioLogado(): Usuario | null {
        return this.authService.obterUsuarioLogado();
    }
}