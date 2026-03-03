export type Role =
  | 'admin_sistema'
  | 'controladoria'
  | 'coordenador_fazenda'
  | 'docente'
  | 'pesquisador'
  | 'supervisor_estagio'
  | 'aluno_estagiario'
  | 'veterinario'
  | 'zootecnista'
  | 'agronomo'
  | 'operador_campo'
  | 'auditor';

export type ModuleKey =
  | 'cadastros'
  | 'producao_agricola'
  | 'pecuaria_bem_estar'
  | 'estoques'
  | 'manutencao_ativos'
  | 'projetos'
  | 'timesheets'
  | 'financas_mvp'
  | 'abc'
  | 'relatorios';

export interface AuditEntry {
  id: string;
  tenantId: string;
  entity: string;
  entityId: string;
  action: string;
  before?: unknown;
  after?: unknown;
  by: string;
  reason?: string;
  timestamp: string;
}

export interface ResourceCost {
  id: string;
  tenantId: string;
  period: string;
  resource: string;
  amount: number;
  driverType: string;
  driverValue: number;
  version: number;
}

export interface ActivityAllocation {
  id: string;
  tenantId: string;
  period: string;
  activity: string;
  objectType: string;
  objectId: string;
  activityDriverValue: number;
  version: number;
}

export interface SyncOperation {
  id: string;
  tenantId: string;
  entity: string;
  entityId: string;
  operation: 'upsert' | 'delete';
  payload: unknown;
  clientVersion: number;
  serverVersion?: number;
  status: 'pending' | 'applied' | 'conflict';
  conflict?: Record<string, { client: unknown; server: unknown }>;
  createdAt: string;
}
