import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service.js';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  async enviar(
    @Body()
    body: {
      email: string;
      nome: string;
    },
  ) {
    return this.emailService.enviarConfirmacaoAgendamento('seuemail@gmail.com', {
  sala: 'Laboratório 1',
  data: '04/11/2026',
  horario: '08:00 - 10:00',
  materia: 'Teste',
});
}
}
