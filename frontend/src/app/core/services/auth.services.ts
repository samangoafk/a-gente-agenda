import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuarios.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private usuarios: Usuario[] = [
        {
            id: 1,
            nome: 'Adam Castro',
            login: 'adam67@gmail.com',
            senha: '12345'
        },
        {
            id: 2,
            nome: 'Yuri Marques',
            login: 'yuriaura@gmail.com',
            senha: 'aura67',
        },
        {
            id: 3,
            nome: 'Matheus Dias',
            login: 'matheusresende@gmail.com',
            senha: 'aura67',
        },
    ];

    private usuarioLogado: Usuario | null = null;

    login(login: string, senha: string): boolean {
        const usuario = this.usuarios.find(
            usuario =>
                usuario.login === login &&
                usuario.senha === senha
        );
        if(!usuario){
            return false;
        }
        this.usuarioLogado = usuario;

        localStorage.setItem(
            'usuarioLogado',
            JSON.stringify(usuario)
        );
        return true;
    }

    logout(): void {
        this.usuarioLogado = null;
        localStorage.removeItem('usuarioLogado');
    }

    estaAutenticado(): boolean {
        return localStorage.getItem('usuarioLogado') !== null;
    }
    
    obterUsuarioLogado(): Usuario | null {
        if (this.usuarioLogado) {
            return this.usuarioLogado;
        }

        const usuarioStorage = localStorage.getItem('usuarioLogado');

        if (!usuarioStorage){
            return null;
        }

        this.usuarioLogado = JSON.parse(usuarioStorage);

        return this.usuarioLogado;
    }

}