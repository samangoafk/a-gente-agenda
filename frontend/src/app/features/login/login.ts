import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../core/services/auth.services';
import { AuthFacade } from '../../core/facades/auth.facades';
import { signal } from '@angular/core';

@Component({
  imports: [FormsModule, ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  formulario = new FormGroup({

    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(4)]),

  });



  private authFacade = inject(AuthFacade);
  private authService = inject(AuthService);
  private router = inject(Router);

  erroLogin = signal(false);

  login = '';
  senha = '';
  mensagemErro = '';

  entrar(): void {
    this.erroLogin.set(false);

    if(this.formulario.invalid){
      this.formulario.markAllAsTouched();
      return;
    }
    const login = this.formulario.value.email ?? '';
    const senha = this.formulario.value.senha ?? '';

    const loginRealizado = this.authFacade.login(this.login, this.senha);

  
    if (!loginRealizado) {
      this.erroLogin.set(true);
      return;
    } 
  }
}
