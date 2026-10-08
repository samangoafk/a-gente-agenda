export interface Agendamento {
  id: number;
  salaId: number;
  salaNome: string;
  tipo?: string;            // ex: 'LABORATÓRIO'
  professorId: number;
  professorNome: string;
  materia: string;
  data: string;             // YYYY-MM-DD
  dataFormatada: string;    // ex: '26 de maio de 2025'
  dia: string;              // ex: '26'
  mes: string;              // ex: 'MAI'
  horario: string;          // ex: '08:00 — 09:30'
  status: 'Confirmado' | 'Pendente' | 'Cancelado';
}