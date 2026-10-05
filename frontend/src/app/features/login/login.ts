import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.services';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  usuario= '';
  senha = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  entrar(): void {
    const loginRealizado = this.authService.login(
      this.usuario,
      this.senha
    );
    if (loginRealizado) {
      this.router.navigate(['/salas']);
    } else{
      alert('Usuário ou senha inválidos!');
    }
  }
}
