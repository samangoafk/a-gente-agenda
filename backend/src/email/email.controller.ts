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
    return this.emailService.enviarEmail(
      body.email,
      body.nome,
    );
  }
}
