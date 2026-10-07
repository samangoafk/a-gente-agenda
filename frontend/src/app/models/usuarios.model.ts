export interface Usuario {
    id: number;
    nome: string;
    login: string;
    senha: string;
    perfil?: string; // Adicione a propriedade perfil como opcional
}