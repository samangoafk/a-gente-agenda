import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../core/services/auth.services';
import { AuthFacade } from '../../core/facades/auth.facades';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private authFacade = inject(AuthFacade);
  private authService = inject(AuthService);
  private router = inject(Router);

  formulario = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  erroLogin = signal(false);

  entrar(): void {
    this.erroLogin.set(false);

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const email = this.formulario.value.email ?? '';
    const senha = this.formulario.value.senha ?? '';

    const loginRealizado = this.authFacade.login(email, senha);

    if (!loginRealizado) {
      this.erroLogin.set(true);
      return;
    }

    this.router.navigate(['/salas']);
  }
}