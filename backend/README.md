# TODO List - Backend API

Sistema de gerenciamento de tarefas - REST API

## Tecnologias

- Node.js
- TypeScript
- Express.js
- MS SQL Server
- Zod (validação)

## Estrutura do Projeto

```
src/
├── api/              # Controladores de API
├── routes/           # Definições de rotas
├── middleware/       # Middlewares Express
├── services/         # Lógica de negócio
├── utils/            # Funções utilitárias
├── constants/        # Constantes da aplicação
├── instances/        # Instâncias de serviços
├── config/           # Configurações
├── tests/            # Utilitários de teste globais
└── server.ts         # Ponto de entrada
```

## Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Configurar variáveis de ambiente no .env
```

## Desenvolvimento

```bash
# Modo desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Testes
npm test
npm run test:watch
npm run test:coverage

# Lint
npm run lint
npm run lint:fix
```

## Configuração do Banco de Dados

1. Criar banco de dados SQL Server
2. Configurar credenciais no arquivo `.env`
3. Executar scripts de estrutura do banco (database/)

## API Endpoints

### Health Check
- `GET /health` - Verificação de saúde da API

### API v1
- Base URL: `/api/v1`
- External (público): `/api/v1/external`
- Internal (autenticado): `/api/v1/internal`

## Variáveis de Ambiente

Ver arquivo `.env.example` para lista completa de variáveis necessárias.

## Padrões de Código

- TypeScript strict mode desabilitado para flexibilidade
- ESLint para qualidade de código
- Convenções de nomenclatura:
  - Arquivos: camelCase
  - Rotas API: kebab-case
  - Funções: camelCase
  - Constantes: UPPER_SNAKE_CASE
  - Interfaces/Types: PascalCase

## Estrutura de Resposta

### Sucesso
```json
{
  "success": true,
  "data": {},
  "metadata": {
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### Erro
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Licença

ISC