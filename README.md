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

## Cobertura de requisitos do MVP

### Implementado

1. **Cadastros Mestres** (navegação e estrutura)
2. **Produção Agrícola** (navegação e estrutura)
3. **Pecuária & Bem-Estar Animal** (navegação e estrutura)
4. **Almoxarifado & Estoques** (navegação e estrutura)
5. **Timesheets** (navegação e estrutura)
6. **Motor ABC funcional**:
   - Recursos -> Atividades -> Objetos de custo
   - Cálculo por período
7. **Offline-first**:
   - PWA instalável
   - Service Worker com cache/fallback
   - CRUD local IndexedDB
   - Fila de sync + envio para API
8. **Sincronização e conflitos**:
   - Push bidirecional (MVP)
   - Detecção de conflito por versão
   - Registro em log de auditoria
9. **Relatórios essenciais**:
   - Dashboard executivo inicial
   - Relatório de alocação ABC no frontend
10. **Documentação in-app**:
    - Página `Documentação do Sistema`

### Arquitetura preparada (backlog)

- Integrações contábeis e financeiras avançadas
- MFA e criptografia em repouso ponta a ponta
- Relatórios PDF/Excel offline completos
- Workflow de resolução manual campo-a-campo completo na UI
- Persistência relacional PostgreSQL (produção)

## Como executar

```bash
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Endpoints principais

- `GET /api/bootstrap` → tenant, usuários, módulos e RBAC
- `GET /api/abc/:period` → cálculo ABC por período
- `POST /api/sync/push` → push da fila offline
- `GET /api/sync/queue` → fila de sincronização (servidor)
- `GET /api/audit` → auditoria de eventos

## Entidades base contempladas

- Tenants/unidades
- Usuários/papéis/permissões
- Recursos/naturezas de custo
- Atividades ABC e objetos de custo
- Apontamentos e fila de sync
- Auditoria e logs
