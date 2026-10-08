export interface Usuario {
    id: number;
    nome: string;
    login: string;
    senha: string;
    perfil?: 'Professor' | 'Coordenador';
    materia?: string;                 // Ex: 'Design de Interfaces', 'Matemática'
    solicitacoesPendentes?: number;    // Para o painel do professor / perfil
}