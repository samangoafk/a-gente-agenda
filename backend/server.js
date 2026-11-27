import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
app.use(express.json());

// ==========================================
// 1. CONFIGURAÇÃO PARA ENVIAR E-MAIL (Porta 1025)
// ==========================================
const carteiro = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false,
  ignoreTLS: true,
});

// Rota para ENVIAR um e-mail
app.post('/enviar', async (req, res) => {
  const { para, assunto, texto } = req.body;

  try {
    const info = await carteiro.sendMail({
      from: '"Meu Sistema" <sistema@teste.local>',
      to: para,
      subject: assunto,
      text: texto,
      html: `<p>${texto}</p>`,
    });

    res.json({ sucesso: true, id: info.messageId });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// ==========================================
// 2. CONFIGURAÇÃO PARA RECEBER/LER E-MAILS (Porta 1080)
// ==========================================
// Rota que busca os e-mails que chegaram no MailDev
app.get('/receber', async (req, res) => {
  try {
    const resposta = await fetch('http://localhost:1080/email');
    const emails = await resposta.json();

    // Formata apenas os dados principais de cada e-mail recebido
    const listaFormatada = emails.map((email) => ({
      id: email.id,
      de: email.from[0]?.address,
      para: email.to[0]?.address,
      assunto: email.subject,
      texto: email.text,
      data: email.time,
    }));

    res.json(listaFormatada);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

app.listen(3000, () => {
  console.log('Backend rodando em http://localhost:3001');
});