import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    if (!apiKey) {
      throw new Error('RESEND_API_KEY não foi configurada no .env');
    }

    this.resend = new Resend(apiKey);
  }

  async enviarEmail(email: string, nome: string) {
    const { data, error } = await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [email],
      subject: 'Bem-vindo!',
      html: `
        <h1>Olá, ${nome}!</h1>

        <p>
          Seja muito bem-vindo ao nosso sistema.
        </p>

        <p>
          Estamos felizes em ter você conosco.
        </p>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}

