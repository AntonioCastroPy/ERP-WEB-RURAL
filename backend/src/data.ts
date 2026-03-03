import { ActivityAllocation, AuditEntry, CropSeason, FieldPlot, HerdLot, ModuleKey, ResourceCost, Role } from './types.js';

export const tenants = [
  { id: 'faef', name: 'Grupo FAEF', city: 'Jaciara - MT' },
  { id: 'flor-de-lotus', name: 'Fazenda Escola Flor de Lótus', city: 'Jaciara - MT' }
];

export const users = [
  { id: 'u-admin', name: 'Admin FAEF', role: 'admin_sistema' as Role, tenantId: 'faef' },
  { id: 'u-control', name: 'Controladoria', role: 'controladoria' as Role, tenantId: 'faef' },
  { id: 'u-docente', name: 'Prof. Agro', role: 'docente' as Role, tenantId: 'flor-de-lotus' }
];

export const moduleCatalog: Array<{ key: ModuleKey; name: string; enabled: boolean }> = [
  { key: 'cadastros', name: 'Cadastros Mestres', enabled: true },
  { key: 'producao_agricola', name: 'Produção Agrícola', enabled: true },
  { key: 'pecuaria_bem_estar', name: 'Pecuária & Bem-Estar Animal', enabled: true },
  { key: 'estoques', name: 'Almoxarifado & Estoques', enabled: true },
  { key: 'manutencao_ativos', name: 'Manutenção de Máquinas/Ativos', enabled: true },
  { key: 'projetos', name: 'Projetos Acadêmicos, Pesquisa e Extensão', enabled: true },
  { key: 'timesheets', name: 'Gestão de Pessoas & Timesheets', enabled: true },
  { key: 'financas_mvp', name: 'Finanças (MVP)', enabled: true },
  { key: 'abc', name: 'Motor ABC', enabled: true },
  { key: 'relatorios', name: 'BI e Relatórios', enabled: true }
];

export const rbacMatrix: Record<Role, ModuleKey[]> = {
  admin_sistema: moduleCatalog.map((m) => m.key),
  controladoria: ['cadastros', 'abc', 'relatorios', 'financas_mvp', 'timesheets'],
  coordenador_fazenda: ['cadastros', 'producao_agricola', 'pecuaria_bem_estar', 'estoques', 'timesheets', 'abc', 'relatorios'],
  docente: ['projetos', 'timesheets', 'relatorios', 'pecuaria_bem_estar', 'producao_agricola'],
  pesquisador: ['projetos', 'abc', 'relatorios'],
  supervisor_estagio: ['timesheets', 'projetos', 'relatorios'],
  aluno_estagiario: ['timesheets'],
  veterinario: ['pecuaria_bem_estar', 'estoques', 'relatorios'],
  zootecnista: ['pecuaria_bem_estar', 'producao_agricola', 'relatorios'],
  agronomo: ['producao_agricola', 'estoques', 'relatorios'],
  operador_campo: ['producao_agricola', 'timesheets', 'estoques'],
  auditor: ['relatorios', 'abc', 'financas_mvp']
};

export const cropSeasons: CropSeason[] = [
  { id: 'safra-2026', tenantId: 'flor-de-lotus', name: 'Safra Verão', year: 2026, status: 'ativa', version: 1 },
  { id: 'safra-2025', tenantId: 'flor-de-lotus', name: 'Safra Inverno', year: 2025, status: 'encerrada', version: 1 }
];

export const fieldPlots: FieldPlot[] = [
  { id: 'plot-1', tenantId: 'flor-de-lotus', code: 'T-01', areaHectares: 42.5, soilType: 'Argiloso', currentSeasonId: 'safra-2026', version: 1 },
  { id: 'plot-2', tenantId: 'flor-de-lotus', code: 'T-02', areaHectares: 37.2, soilType: 'Arenoso', currentSeasonId: 'safra-2026', version: 1 }
];

export const herdLots: HerdLot[] = [
  { id: 'lot-1', tenantId: 'flor-de-lotus', code: 'L-NELORE', species: 'Bovino', breed: 'Nelore', headCount: 85, version: 1 },
  { id: 'lot-2', tenantId: 'flor-de-lotus', code: 'L-CORTE', species: 'Bovino', breed: 'Angus', headCount: 64, version: 1 }
];

export const resourceCosts: ResourceCost[] = [
  { id: 'r1', tenantId: 'flor-de-lotus', period: '2026-01', resource: 'Mão de obra', amount: 68000, driverType: 'horas', driverValue: 3200, version: 1 },
  { id: 'r2', tenantId: 'flor-de-lotus', period: '2026-01', resource: 'Combustível', amount: 24000, driverType: 'litros', driverValue: 5600, version: 1 },
  { id: 'r3', tenantId: 'flor-de-lotus', period: '2026-01', resource: 'Ração', amount: 18000, driverType: 'kg', driverValue: 9000, version: 1 }
];

export const activityAllocations: ActivityAllocation[] = [
  { id: 'a1', tenantId: 'flor-de-lotus', period: '2026-01', activity: 'Plantio', objectType: 'talhao', objectId: 'T-01', activityDriverValue: 120, version: 1 },
  { id: 'a2', tenantId: 'flor-de-lotus', period: '2026-01', activity: 'Manejo sanitário', objectType: 'lote', objectId: 'L-NELORE', activityDriverValue: 90, version: 1 },
  { id: 'a3', tenantId: 'flor-de-lotus', period: '2026-01', activity: 'Aula prática', objectType: 'turma', objectId: 'ZOO-2026-A', activityDriverValue: 40, version: 1 }
];

export const auditLog: AuditEntry[] = [];
