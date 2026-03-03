import cors from 'cors';
import express, { Request, Response } from 'express';
import { z } from 'zod';
import { calculateAbc } from './abc.js';
import {
  activityAllocations,
  auditLog,
  cropSeasons,
  fieldPlots,
  herdLots,
  moduleCatalog,
  rbacMatrix,
  resourceCosts,
  tenants,
  users
} from './data.js';
import { CropSeason, FieldPlot, HerdLot, PaginatedResult, SyncOperation } from './types.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const syncQueue: SyncOperation[] = [];

function registerAudit(tenantId: string, entity: string, entityId: string, action: string, by: string, before?: unknown, after?: unknown, reason?: string) {
  auditLog.push({
    id: `audit-${Date.now()}-${Math.random()}`,
    tenantId,
    entity,
    entityId,
    action,
    by,
    before,
    after,
    reason,
    timestamp: new Date().toISOString()
  });
}

type SortDirection = 'asc' | 'desc';
const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().optional(),
  sortField: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).default('asc')
});

function paginateAndSort<T>(items: T[], query: z.infer<typeof listQuerySchema>, searchableFields: Array<keyof T>): PaginatedResult<T> {
  const q = query.q?.trim().toLowerCase();
  const filtered = q
    ? items.filter((item) =>
        searchableFields.some((field) => String((item as Record<string, unknown>)[field as string] ?? '').toLowerCase().includes(q))
      )
    : items;

  const sorted = [...filtered];
  const sortField = query.sortField as keyof T | undefined;
  if (sortField) {
    sorted.sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortField as string];
      const bv = (b as Record<string, unknown>)[sortField as string];
      if (av === bv) return 0;
      const result = String(av ?? '').localeCompare(String(bv ?? ''), 'pt-BR', { numeric: true });
      return query.sortDirection === 'asc' ? result : -result;
    });
  }

  const start = (query.page - 1) * query.pageSize;
  const data = sorted.slice(start, start + query.pageSize);
  return { data, page: query.page, pageSize: query.pageSize, totalCount: sorted.length };
}

function readById<T extends { id: string }>(res: express.Response, collection: T[], id: string, message: string) {
  const item = collection.find((i) => i.id === id);
  if (!item) return res.status(404).json({ message });
  return res.json(item);
}

app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok', service: 'erp-web-rural-backend' }));

app.get('/api/bootstrap', (_req: Request, res: Response) => {
  res.json({
    tenant: tenants[1],
    users,
    modules: moduleCatalog,
    rbacMatrix,
    seed: {
      safra: 'Safra 2026',
      talhoes: ['T-01', 'T-02'],
      lotes: ['L-NELORE', 'L-CORTE'],
      projetos: ['Projeto Semeia', 'Pesquisa Bem-Estar Bovina']
    }
  });
});

// Compatibilidade com versão anterior
app.get('/api/cadastros/overview', (_req: Request, res: Response) => {
  res.json({ cropSeasons, fieldPlots, herdLots });
});

const seasonSchema = z.object({ name: z.string().min(2), year: z.number().int(), status: z.enum(['planejada', 'ativa', 'encerrada']) });
app.get('/api/cadastros/safras', (req: Request, res: Response) => {
  const query = listQuerySchema.parse(req.query);
  res.json(paginateAndSort(cropSeasons, query, ['name', 'status']));
});
app.get('/api/cadastros/safras/:id', (req: Request, res: Response) => readById(res, cropSeasons, req.params.id, 'Safra não encontrada'));
app.post('/api/cadastros/safras', (req: Request, res: Response) => {
  const payload = seasonSchema.parse(req.body);
  const item: CropSeason = {
    id: `safra-${crypto.randomUUID()}`,
    tenantId: 'flor-de-lotus',
    ...payload,
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'u-admin'
  };
  cropSeasons.unshift(item);
  registerAudit(item.tenantId, 'cropSeason', item.id, 'create', item.updatedBy, undefined, item);
  res.status(201).json(item);
});
app.put('/api/cadastros/safras/:id', (req: Request, res: Response) => {
  const payload = seasonSchema.parse(req.body);
  const idx = cropSeasons.findIndex((i) => i.id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Safra não encontrada' });
  const before = cropSeasons[idx];
  const updated: CropSeason = {
    ...before,
    ...payload,
    version: before.version + 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'u-admin'
  };
  cropSeasons[idx] = updated;
  registerAudit(updated.tenantId, 'cropSeason', updated.id, 'update', updated.updatedBy, before, updated);
  res.json(updated);
});
app.delete('/api/cadastros/safras/:id', (req: Request, res: Response) => {
  const idx = cropSeasons.findIndex((i) => i.id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Safra não encontrada' });
  const [removed] = cropSeasons.splice(idx, 1);
  registerAudit(removed.tenantId, 'cropSeason', removed.id, 'delete', 'u-admin', removed, undefined);
  res.status(204).send();
});

const plotSchema = z.object({ code: z.string().min(2), areaHectares: z.number().positive(), soilType: z.string().min(2), currentSeasonId: z.string().min(2) });
app.get('/api/cadastros/talhoes', (req: Request, res: Response) => {
  const query = listQuerySchema.parse(req.query);
  res.json(paginateAndSort(fieldPlots, query, ['code', 'soilType', 'currentSeasonId']));
});
app.get('/api/cadastros/talhoes/:id', (req: Request, res: Response) => readById(res, fieldPlots, req.params.id, 'Talhão não encontrado'));
app.post('/api/cadastros/talhoes', (req: Request, res: Response) => {
  const payload = plotSchema.parse(req.body);
  const item: FieldPlot = {
    id: `plot-${crypto.randomUUID()}`,
    tenantId: 'flor-de-lotus',
    ...payload,
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'u-admin'
  };
  fieldPlots.unshift(item);
  registerAudit(item.tenantId, 'fieldPlot', item.id, 'create', item.updatedBy, undefined, item);
  res.status(201).json(item);
});
app.put('/api/cadastros/talhoes/:id', (req: Request, res: Response) => {
  const payload = plotSchema.parse(req.body);
  const idx = fieldPlots.findIndex((i) => i.id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Talhão não encontrado' });
  const before = fieldPlots[idx];
  const updated: FieldPlot = {
    ...before,
    ...payload,
    version: before.version + 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'u-admin'
  };
  fieldPlots[idx] = updated;
  registerAudit(updated.tenantId, 'fieldPlot', updated.id, 'update', updated.updatedBy, before, updated);
  res.json(updated);
});
app.delete('/api/cadastros/talhoes/:id', (req: Request, res: Response) => {
  const idx = fieldPlots.findIndex((i) => i.id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Talhão não encontrado' });
  const [removed] = fieldPlots.splice(idx, 1);
  registerAudit(removed.tenantId, 'fieldPlot', removed.id, 'delete', 'u-admin', removed, undefined);
  res.status(204).send();
});

const lotSchema = z.object({ code: z.string().min(2), species: z.string().min(2), breed: z.string().min(2), headCount: z.number().int().positive() });
app.get('/api/cadastros/lotes', (req: Request, res: Response) => {
  const query = listQuerySchema.parse(req.query);
  res.json(paginateAndSort(herdLots, query, ['code', 'species', 'breed']));
});
app.get('/api/cadastros/lotes/:id', (req: Request, res: Response) => readById(res, herdLots, req.params.id, 'Lote não encontrado'));
app.post('/api/cadastros/lotes', (req: Request, res: Response) => {
  const payload = lotSchema.parse(req.body);
  const item: HerdLot = {
    id: `lot-${crypto.randomUUID()}`,
    tenantId: 'flor-de-lotus',
    ...payload,
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'u-admin'
  };
  herdLots.unshift(item);
  registerAudit(item.tenantId, 'herdLot', item.id, 'create', item.updatedBy, undefined, item);
  res.status(201).json(item);
});
app.put('/api/cadastros/lotes/:id', (req: Request, res: Response) => {
  const payload = lotSchema.parse(req.body);
  const idx = herdLots.findIndex((i) => i.id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Lote não encontrado' });
  const before = herdLots[idx];
  const updated: HerdLot = {
    ...before,
    ...payload,
    version: before.version + 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'u-admin'
  };
  herdLots[idx] = updated;
  registerAudit(updated.tenantId, 'herdLot', updated.id, 'update', updated.updatedBy, before, updated);
  res.json(updated);
});
app.delete('/api/cadastros/lotes/:id', (req: Request, res: Response) => {
  const idx = herdLots.findIndex((i) => i.id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Lote não encontrado' });
  const [removed] = herdLots.splice(idx, 1);
  registerAudit(removed.tenantId, 'herdLot', removed.id, 'delete', 'u-admin', removed, undefined);
  res.status(204).send();
});

app.get('/api/abc/:period', (req: Request, res: Response) => {
  res.json(calculateAbc(req.params.period, resourceCosts, activityAllocations));
});

app.post('/api/sync/push', (req: Request, res: Response) => {
  const schema = z.object({
    tenantId: z.string(),
    operations: z.array(
      z.object({
        id: z.string(),
        entity: z.string(),
        entityId: z.string(),
        operation: z.enum(['upsert', 'delete']),
        payload: z.unknown(),
        clientVersion: z.number(),
        updatedBy: z.string()
      })
    )
  });

  const payload = schema.parse(req.body);

  const result = payload.operations.map((op) => {
    const serverVersion = 1;
    const hasConflict = op.clientVersion < serverVersion;
    const item: SyncOperation = {
      id: op.id,
      tenantId: payload.tenantId,
      entity: op.entity,
      entityId: op.entityId,
      operation: op.operation,
      payload: op.payload,
      clientVersion: op.clientVersion,
      serverVersion,
      status: hasConflict ? 'conflict' : 'applied',
      conflict: hasConflict
        ? {
            value: {
              client: op.payload,
              server: { message: 'Versão do servidor mais nova' }
            }
          }
        : undefined,
      createdAt: new Date().toISOString()
    };
    syncQueue.push(item);
    registerAudit(payload.tenantId, op.entity, op.entityId, `sync_${item.status}`, op.updatedBy, undefined, op.payload, hasConflict ? 'Conflito detectado por versionamento' : 'Sync aplicado');
    return item;
  });

  res.json({ applied: result.filter((r) => r.status === 'applied').length, conflicts: result.filter((r) => r.status === 'conflict').length, result });
});

app.get('/api/sync/queue', (_req: Request, res: Response) => {
  res.json(syncQueue);
});

app.get('/api/audit', (_req: Request, res: Response) => {
  res.json(auditLog.slice(-100));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend ERP Web Rural ativo na porta ${port}`);
});
