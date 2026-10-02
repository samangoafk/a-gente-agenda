import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    login(usuario: string, senha: string): boolean {
        if (usuario === 'marina@gmail.com' && senha === '12345678'){
            localStorage.setItem('usuarioLogado', 'true');
            return true;
        }

        return false;
    }

    logout(): void {
        localStorage.removeItem('usuarioLogado');
    }
    estaAutenticado(): boolean {
        return localStorage.getItem('usuarioLogado') === 'true';
    }
}