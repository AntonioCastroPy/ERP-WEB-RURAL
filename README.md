# ERP WEB RURAL — Gestão de Custos ABC (Fazenda Escola Flor de Lótus)

Projeto ERP web modular, escalável e offline-first para a Fazenda Escola Flor de Lótus (Grupo FAEF / Faculdade Eduvale), com foco em custeio ABC (Activity Based Costing), governança e operação multiunidade/multi-safra.

## Arquitetura

- **Frontend (`frontend/`)**: React + Vite + PWA + IndexedDB (Dexie)
- **Backend (`backend/`)**: Node.js + Express + API REST
- **Estratégia de dados**:
  - Offline-first local em IndexedDB
  - Fila de sincronização bidirecional com retentativas
  - Versionamento por registro e política de conflito auditável
- **RBAC** por perfil e permissões por módulo
- **Módulos plugáveis**: catálogo de módulos habilitáveis

## Refatoração corporativa — Cadastros Mestres

O módulo foi refatorado para padrão ERP escalável com navegação por entidade:

- `/cadastros/safras`
- `/cadastros/talhoes`
- `/cadastros/lotes`

### Componentes genéricos implementados

- `EntityPageLayout` (header + action bar + conteúdo)
- `EntityTable` (paginação, ordenação, colunas padrão de auditoria)
- `EntityModalForm` (create/edit dinâmico por schema)
- `ConfirmDialog` (exclusão)

### Capacidades funcionais

- Busca por entidade
- Paginação server-side
- Ordenação por coluna
- Loading (skeleton), Empty state e Error state com retry
- Modal com foco inicial, fechamento por ESC/clique fora e bloqueio de scroll
- RBAC por entidade (view/create/edit/delete)

## Cobertura de requisitos do MVP

1. **Cadastros Mestres funcional (v2)**
   - API REST paginada por entidade
   - CRUD via modal e tabela genérica
   - Auditoria com `updatedAt` e `updatedBy`
2. **Produção Agrícola** (estrutura de navegação)
3. **Pecuária & Bem-Estar Animal** (estrutura de navegação)
4. **Almoxarifado & Estoques** (estrutura de navegação)
5. **Timesheets** (estrutura de navegação)
6. **Motor ABC funcional**
7. **Offline-first** com IndexedDB + Sync MVP
8. **Documentação in-app**

## Como executar

```bash
npm install
npm run dev:backend
npm run dev:frontend
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Endpoints principais

### Cadastros Mestres (REST + paginação)

- `GET /api/cadastros/safras?page=1&pageSize=10&sortField=name&sortDirection=asc&q=verao`
- `GET /api/cadastros/safras/:id`
- `POST /api/cadastros/safras`
- `PUT /api/cadastros/safras/:id`
- `DELETE /api/cadastros/safras/:id`

- `GET /api/cadastros/talhoes?page=1&pageSize=10&sortField=code&sortDirection=asc&q=T-01`
- `GET /api/cadastros/talhoes/:id`
- `POST /api/cadastros/talhoes`
- `PUT /api/cadastros/talhoes/:id`
- `DELETE /api/cadastros/talhoes/:id`

- `GET /api/cadastros/lotes?page=1&pageSize=10&sortField=code&sortDirection=asc&q=nelore`
- `GET /api/cadastros/lotes/:id`
- `POST /api/cadastros/lotes`
- `PUT /api/cadastros/lotes/:id`
- `DELETE /api/cadastros/lotes/:id`

### Compatibilidade

- `GET /api/cadastros/overview` (mantido para retrocompatibilidade)
- `GET /api/bootstrap`
- `GET /api/abc/:period`
- `POST /api/sync/push`
- `GET /api/sync/queue`
- `GET /api/audit`
