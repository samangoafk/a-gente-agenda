import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

export interface DadosAgendamento {
  sala: string;
  data: string;
  horario: string;
  materia?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASS'),
      },
    });
  }

  async enviarConfirmacaoAgendamento(para: string, dados: DadosAgendamento) {
    try {
      await this.transporter.sendMail({
        from: this.config.get<string>('MAIL_FROM'),
        to: para,
        subject: `Reserva confirmada: ${dados.sala}`,
        html: `
          <h2>Reserva confirmada ✅</h2>
          <p><strong>Sala:</strong> ${dados.sala}</p>
          <p><strong>Data:</strong> ${dados.data}</p>
          <p><strong>Horário:</strong> ${dados.horario}</p>
          ${dados.materia ? `<p><strong>Matéria:</strong> ${dados.materia}</p>` : ''}
        `,
      });
    } catch (err) {
      // não derruba o agendamento se o e-mail falhar
      this.logger.error(`Falha ao enviar e-mail para ${para}`, err as Error);
    }
  }
}