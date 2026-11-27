import { Injectable, InternalServerErrorException } from '@nestjs/common';

interface DadosAgendamento {
  professorNome: string;
  professorEmail: string;
  coordenadorEmail: string;
  sala: string;
  materia?: string;
  dataHorario: string;
  descricao?: string;
}

@Injectable()
export class EmailService {
  private readonly brevoApiKey = process.env.BREVO_API_KEY ?? '';
private readonly remetenteEmail = process.env.EMAIL_REMETENTE ?? 'yurim.contato@gmail.com';
  private readonly remetenteNome = 'Coordenação Acadêmica';

  private async dispararBrevo(
    paraEmail: string,
    paraNome: string,
    assunto: string,
    html: string,
    textoPuro: string,
  ) {
    const resposta = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': this.brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: this.remetenteNome, email: this.remetenteEmail },
        replyTo: { name: this.remetenteNome, email: this.remetenteEmail },
        to: [{ email: paraEmail, name: paraNome }],
        subject: assunto,
        htmlContent: html,
        textContent: textoPuro,
      }),
    });

    if (!resposta.ok) {
      const erroDetalhe = await resposta.text();
      console.error('Erro na API do Brevo:', erroDetalhe);
      throw new InternalServerErrorException('Falha ao enviar e-mail pelo Brevo');
    }

    return resposta.json();
  }

  private montarLayoutBase(
    tituloCabecalho: string,
    badgeTexto: string,
    badgeCorFundo: string,
    badgeCorTexto: string,
    conteudoInterno: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f6f9; padding: 32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06); border: 1px solid #e2e8f0;">
                
                <tr>
                  <td style="background-color: #0f172a; padding: 28px 32px;">
                    <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #93c5fd;">
                      Gestão de Espaços Acadêmicos
                    </p>
                    <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; line-height: 1.3;">
                      ${tituloCabecalho}
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 24px 32px 0 32px;">
                    <span style="display: inline-block; background-color: ${badgeCorFundo}; color: ${badgeCorTexto}; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 999px;">
                      ● ${badgeTexto}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 20px 32px 28px 32px; font-size: 15px; line-height: 1.6; color: #334155;">
                    ${conteudoInterno}
                  </td>
                </tr>

                <tr>
                  <td style="background-color: #f8fafc; padding: 18px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #64748b;">
                      Plataforma de Agendamento de Salas • Secretaria Acadêmica
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  private montarCartaoDetalhes(dados: DadosAgendamento, incluirProfessor: boolean): string {
    return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
        <tr>
          <td style="padding: 16px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px;">
              ${incluirProfessor ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 130px; vertical-align: top;">Solicitante:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${dados.professorNome}<br><span style="font-size: 12px; font-weight: 400; color: #64748b;">${dados.professorEmail}</span></td>
              </tr>` : ''}
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 130px; vertical-align: top;">Espaço / Sala:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${dados.sala}</td>
              </tr>
              ${dados.materia ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b; vertical-align: top;">Disciplina:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 500;">${dados.materia}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 6px 0; color: #64748b; vertical-align: top;">Data e Horário:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${dados.dataHorario}</td>
              </tr>
              ${dados.descricao ? `
              <tr>
                <td style="padding: 8px 0 2px 0; color: #64748b; vertical-align: top; border-top: 1px dashed #cbd5e1;">Observações:</td>
                <td style="padding: 8px 0 2px 0; color: #334155; font-style: italic; border-top: 1px dashed #cbd5e1;">"${dados.descricao}"</td>
              </tr>` : ''}
            </table>
          </td>
        </tr>
      </table>
    `;
  }

  async enviarEmail(email: string, nome: string) {
    const dados = await this.dispararBrevo(
      email,
      nome,
      'Seu acesso à plataforma de agendamentos',
      this.montarLayoutBase(
        'Acesso Confirmado',
        'Conta Ativa',
        '#dcfce7',
        '#166534',
        `<p>Olá, <strong>${nome}</strong>! Seu cadastro na plataforma de reserva de espaços acadêmicos já está liberado.</p>`,
      ),
      `Olá, ${nome}! Seu cadastro na plataforma de reserva de espaços acadêmicos já está liberado.`,
    );
    return { sucesso: true, messageId: dados.messageId };
  }

  async notificarNovoAgendamento(dados: DadosAgendamento) {
    const htmlProfessor = this.montarLayoutBase(
      'Solicitação de Reserva Registrada',
      'Aguardando Aprovação da Coordenação',
      '#fef3c7',
      '#92400e',
      `
        <p style="margin-top: 0;">Olá, <strong>Prof. ${dados.professorNome}</strong>,</p>
        <p>Recebemos o seu pedido de agendamento e ele já está na fila de análise da coordenação. Seguem os detalhes registrados:</p>
        ${this.montarCartaoDetalhes(dados, false)}
        <p style="margin-bottom: 0; font-size: 13px; color: #64748b;">
          Assim que a coordenação validar o horário, enviaremos a confirmação por aqui.
        </p>
      `,
    );

    const textoProfessor = `Olá, Prof. ${dados.professorNome}. Recebemos o seu pedido de agendamento para ${dados.sala} em ${dados.dataHorario}. Ele está aguardando aprovação da coordenação.`;

    const htmlCoordenador = this.montarLayoutBase(
      'Nova Solicitação de Reserva de Sala',
      'Aguardando Validação',
      '#dbeafe',
      '#1e40af',
      `
        <p style="margin-top: 0;">Olá, <strong>Coordenação</strong>,</p>
        <p>O professor <strong>${dados.professorNome}</strong> registrou um novo pedido de reserva de espaço:</p>
        ${this.montarCartaoDetalhes(dados, true)}
        <div style="background-color: #eff6ff; border-left: 4px solid #1d4ed8; padding: 12px 16px; border-radius: 4px; margin-top: 20px;">
          <p style="margin: 0; font-size: 13px; color: #1e3a8a;">
            <strong>Próximo passo:</strong> Acesse o sistema na aba <em>Solicitações Pendentes</em> para aprovar ou recusar este pedido.
          </p>
        </div>
      `,
    );

    const textoCoordenador = `Olá, Coordenação. O professor ${dados.professorNome} solicitou a reserva de ${dados.sala} para ${dados.dataHorario}. Acesse o sistema na aba Solicitações Pendentes para avaliar.`;

    const envioProfessor = this.dispararBrevo(
      dados.professorEmail,
      dados.professorNome,
      `Comprovante de solicitação: ${dados.sala}`,
      htmlProfessor,
      textoProfessor,
    );

    const envioCoordenador = this.dispararBrevo(
      dados.coordenadorEmail,
      'Coordenação Acadêmica',
      `Pedido de reserva de sala: ${dados.sala} (${dados.professorNome})`,
      htmlCoordenador,
      textoCoordenador,
    );

    await Promise.all([envioProfessor, envioCoordenador]);
    return { sucesso: true };
  }
}