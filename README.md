# 🏫 Sistema de Agendamento de Salas e Laboratórios

Sistema web desenvolvido em Angular para gestão, consulta de disponibilidade e agendamento em tempo real de salas de aula e laboratórios acadêmicos.

---

## 🚀 Funcionalidades

- **Dashboard de Salas (`/salas`)**:
  - Relógio digital em tempo real integrado ao cabeçalho.
  - Filtro rápido por status (*Todas* / *Disponíveis*).
  - Calendário customizado no tema do sistema (`#00a884`) com bloqueio automático de datas passadas e fins de semana.
  - Seletor de data dinâmico integrado ao fluxo de reservas.
  
- **Fluxo de Agendamento (`/agendamentos/:id`)**:
  - Recebe o ID do ambiente e a data selecionada via parâmetros de URL (`queryParams`).
  - Sincronização automática da data nos formatos extenso (cabeçalho) e curto (painel lateral de resumo).
  - Seleção de matéria ministrada e visualização de slots de horários (*Livre* / *Ocupado* com nome do professor e disciplina).
  - Confirmação de reserva com atualização visual imediata.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [Angular](https://angular.dev/) (Componentes Standalone)
- **Linguagem**: TypeScript
- **Estilização**: CSS3 (CSS Variables, Flexbox, CSS Grid)
- **Roteamento**: Angular Router (`ActivatedRoute`, `Router`)

---

## 📁 Estrutura do Projeto

```text
src/app/
├── pages/
│   ├── salas/
│   │   ├── salas.ts          # Lógica do relógio, filtro e calendário customizado
│   │   ├── salas.html        # Grid de salas e popover do calendário
│   │   └── salas.css         # Estilização completa e temas
│   └── agendamentos/
│       ├── agendamentos.ts   # Sincronização de queryParams e lógica de horários
│       ├── agendamentos.html # Layout responsivo de 2 colunas (slots e resumo)
│       └── agendamentos.css  # Estilos da página de agendamento
├── shared/
│   └── components/
│       ├── header/           # Cabeçalho global
│       ├── card-status-sala/ # Card individual de exibição do status da sala
│       └── pop-up-reserva-sala/ # Modal de confirmação/pré-reserva
└── app.routes.ts             # Configuração e mapeamento das rotas da aplicação

⚙️ Como Rodar o Projeto Localmente
Pré-requisitos
Node.js: v18.x ou superior

npm: v9.x ou superior

Angular CLI: v17.x ou superior

Passo a passo

Clone o repositório:
git clone [https://github.com/seu-usuario/seu-repositorio.git] (https://github.com/seu-usuario/seu-repositorio.git)

Acesse a pasta do projeto:

Bash
cd seu-repositorio

Instale as dependências:

Bash
npm install

Inicie o servidor de desenvolvimento:

Bash
ng serve

Acesse no navegador:
Abra http://localhost:4200/ para visualizar a aplicação.